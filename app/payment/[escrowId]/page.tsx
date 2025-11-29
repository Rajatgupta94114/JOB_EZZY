'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { ArrowLeft, Wallet, Send, Copy, Check } from 'lucide-react';
import CoinAnimation from '@/components/CoinAnimation';
import RatingModal from '@/components/RatingModal';
import { useTonWallet } from '@/hooks/useTonWallet';

interface Escrow {
  id: string;
  applicationId: string;
  companyId: string;
  candidateId: string;
  jobTitle: string;
  amount: string;
  currency: string;
  status: string;
  confirmationStatus: string;
}

interface Payment {
  id: string;
  escrowId: string;
  companyId: string;
  candidateId: string;
  amount: string;
  currency: string;
  candidateWalletAddress: string | null;
  transactionHash: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const escrowId = params.escrowId as string;
  const { user, isAuthenticated } = useAuthStore();
  const { walletAddress: companyWallet, isConnecting: connecting, connectWallet } = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidateWallet, setCandidateWallet] = useState('');
  const [step, setStep] = useState<'wallet_connect' | 'request_wallet' | 'send_payment' | 'completed'>('wallet_connect');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    fetchData();
  }, [escrowId]);

  // Auto-proceed to next step when wallet is connected
  useEffect(() => {
    if (companyWallet && step === 'wallet_connect') {
      setStep('request_wallet');
    }
  }, [companyWallet, step]);

  const fetchData = async () => {
    try {
      const [escrowRes, paymentsRes, usersRes] = await Promise.all([
        fetch('/api/escrow'),
        fetch(`/api/payments?escrowId=${escrowId}`),
        fetch('/api/users'),
      ]);

      if (escrowRes.ok && paymentsRes.ok && usersRes.ok) {
        const escrows = await escrowRes.json();
        const payments = await paymentsRes.json();
        const users = await usersRes.json();

        const foundEscrow = escrows.find((e: Escrow) => e.id === escrowId);
        const foundPayment = payments[0] || null;
        const company = users.find((u: any) => u.id === foundEscrow?.companyId);

        setEscrow(foundEscrow);
        setPayment(foundPayment);
        if (company) setCompanyName(company.name);

        if (foundPayment) {
          if (foundPayment.status === 'completed') {
            setStep('completed');
            // Trigger animation for candidate
            if (user?.role === 'candidate') {
              setShowCoinAnimation(true);
            }
          } else if (foundPayment.candidateWalletAddress) {
            setStep('send_payment');
            setCandidateWallet(foundPayment.candidateWalletAddress);
          } else {
            setStep('request_wallet');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error with wallet connection:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  // Create payment record when wallet is connected
  useEffect(() => {
    const createPaymentRecord = async () => {
      if (companyWallet && !payment && step === 'request_wallet') {
        try {
          const response = await fetch('/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              escrowId,
              companyId: user?.id,
              candidateId: escrow?.candidateId,
              amount: escrow?.amount,
              currency: escrow?.currency,
              status: 'wallet_requested',
            }),
          });

          if (response.ok) {
            const newPayment = await response.json();
            setPayment(newPayment);
          }
        } catch (error) {
          console.error('Error creating payment record:', error);
        }
      }
    };

    createPaymentRecord();
  }, [companyWallet, step, payment, escrowId, user?.id, escrow?.candidateId, escrow?.amount, escrow?.currency]);

  const handleRequestWallet = async () => {
    // In a real app, this would send a notification to the candidate
    // For now, we'll just move to the next step
    setStep('send_payment');
  };

  const handleCopyWallet = () => {
    if (companyWallet) {
      navigator.clipboard.writeText(companyWallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendPayment = async () => {
    if (!candidateWallet) {
      alert('Please enter candidate wallet address');
      return;
    }

    if (!tonConnectUI.account) {
      alert('Wallet not connected. Please connect your wallet first.');
      return;
    }

    setSubmitting(true);
    try {
      // Create TON transaction
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        messages: [
          {
            address: candidateWallet,
            amount: (parseFloat(escrow?.amount || '0') * 1e9).toString(), // Convert TON to nanotons
            payload: 'te4VcgEBAQEADAADABFqYXNvbiBwYXltZW50', // Base64 encoded "json payment"
          },
        ],
      };

      // Send transaction using Tonkeeper
      const result = await tonConnectUI.sendTransaction(transaction);

      if (result) {
        // Transaction was sent, now verify it
        const verifyResponse = await fetch('/api/ton-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderAddress: tonConnectUI.account.address,
            destinationAddress: candidateWallet,
            amount: escrow?.amount,
            comment: `Payment for ${escrow?.jobTitle}`,
            paymentId: payment?.id,
          }),
        });

        if (verifyResponse.ok) {
          // Update payment with transaction details
          const updateResponse = await fetch('/api/payments', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: payment?.id,
              status: 'completed',
              candidateWalletAddress: candidateWallet,
              transactionHash: result.boc || 'transaction_sent',
            }),
          });

          if (updateResponse.ok) {
            const updatedPayment = await updateResponse.json();
            setPayment(updatedPayment);

            // Update escrow payment status
            await fetch('/api/escrow', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: escrowId,
                paymentStatus: 'completed',
              }),
            });

            setStep('completed');
            alert('Payment sent successfully! Transaction is being processed on the TON blockchain.');
          }
        }
      }
    } catch (error) {
      console.error('Error sending payment:', error);
      if (error instanceof Error) {
        alert(`Payment failed: ${error.message}`);
      } else {
        alert('Failed to send payment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: escrow?.companyId,
          candidateId: user?.id,
          escrowId: escrowId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        alert('Rating submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  };

  if (!isAuthenticated || !user) return null;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" suppressHydrationWarning>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
          <p className="text-dark-300">Loading payment...</p>
        </div>
      </main>
    );
  }

  if (!escrow) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" suppressHydrationWarning>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
          <p className="text-dark-300">Escrow not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" suppressHydrationWarning>
      <CoinAnimation
        isVisible={showCoinAnimation}
        direction={user?.role === 'candidate' ? 'down' : 'up'}
        sbtAmount={10}
        onComplete={() => {
          setShowCoinAnimation(false);
          if (user?.role === 'candidate') {
            setShowRatingModal(true);
          }
        }}
      />

      <RatingModal
        isOpen={showRatingModal}
        companyId={escrow?.companyId || ''}
        candidateId={user?.id || ''}
        escrowId={escrowId}
        companyName={companyName}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
      />

      <Navigation />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-32 md:pb-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 sm:mb-8 p-2 rounded-lg hover:bg-white/10 transition-all inline-block"
        >
          <ArrowLeft size={20} className="sm:w-6 sm:h-6 text-primary-400" />
        </button>

        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-2xl sm:text-4xl font-bold gradient-text mb-2">Payment Processing</h1>
          <p className="text-xs sm:text-sm text-dark-300">Complete payment for {escrow.jobTitle}</p>
        </div>

        {/* Payment Details */}
        <div className="glass-dark rounded-xl p-6 mb-8 animate-fadeInUp">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-dark-800/50 p-4 rounded-lg">
              <p className="text-dark-400 text-xs sm:text-sm mb-2">Position</p>
              <p className="text-white font-bold">{escrow.jobTitle}</p>
            </div>
            <div className="bg-dark-800/50 p-4 rounded-lg">
              <p className="text-dark-400 text-xs sm:text-sm mb-2">Payment Amount</p>
              <p className="text-2xl sm:text-3xl font-bold gradient-text">{escrow.amount} {escrow.currency}</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${step === 'wallet_connect' ? 'bg-primary-400' : companyWallet ? 'bg-green-400' : 'bg-dark-600'}`}></div>
            <span className="text-sm text-dark-300">Connect Wallet</span>
            <div className="flex-1 h-0.5 bg-dark-700 mx-2"></div>
            <div className={`w-3 h-3 rounded-full ${step === 'request_wallet' ? 'bg-primary-400' : step === 'send_payment' || step === 'completed' ? 'bg-green-400' : 'bg-dark-600'}`}></div>
            <span className="text-sm text-dark-300">Request Wallet</span>
            <div className="flex-1 h-0.5 bg-dark-700 mx-2"></div>
            <div className={`w-3 h-3 rounded-full ${step === 'send_payment' ? 'bg-primary-400' : step === 'completed' ? 'bg-green-400' : 'bg-dark-600'}`}></div>
            <span className="text-sm text-dark-300">Send Payment</span>
          </div>
        </div>

        {/* Step 1: Connect Wallet */}
        {step === 'wallet_connect' && (
          <div className="glass-dark rounded-xl p-6 mb-8 animate-fadeInUp">
            <div className="flex items-center gap-3 mb-4">
              <Wallet size={24} className="text-primary-400" />
              <h2 className="text-xl font-bold text-white">Connect Your Wallet</h2>
            </div>
            <p className="text-dark-300 mb-6">Connect your TON wallet to proceed with payment. A modal will open to connect your wallet.</p>
            
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-6">
              <p className="text-blue-300 text-sm">
                ℹ️ Click the button below to open the TON Connect modal. Select your wallet and authorize the connection.
              </p>
            </div>

            <button
              onClick={handleConnectWallet}
              disabled={connecting}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Wallet size={20} />
              {connecting ? 'Connecting...' : 'Connect TON Wallet'}
            </button>
          </div>
        )}

        {/* Step 2: Request Wallet Address */}
        {step === 'request_wallet' && (
          <div className="glass-dark rounded-xl p-6 mb-8 animate-fadeInUp">
            <div className="flex items-center gap-3 mb-4">
              <Send size={24} className="text-accent-400" />
              <h2 className="text-xl font-bold text-white">Request Candidate Wallet</h2>
            </div>
            <p className="text-dark-300 mb-6">A request has been sent to the candidate to provide their wallet address</p>
            
            <div className="bg-dark-800/50 p-4 rounded-lg mb-6">
              <p className="text-dark-400 text-sm mb-2">Your Wallet Address (for reference)</p>
              <div className="flex items-center gap-2">
                <p className="text-white font-mono text-xs sm:text-sm break-all">{companyWallet}</p>
                <button
                  onClick={handleCopyWallet}
                  className="flex-shrink-0 p-2 hover:bg-dark-700 rounded transition-all"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-primary-400" />}
                </button>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-6">
              <p className="text-blue-300 text-sm">
                ℹ️ The candidate will receive a notification to share their wallet address. Once they do, you can proceed with the payment.
              </p>
            </div>

            <button
              onClick={handleRequestWallet}
              className="w-full py-3 px-4 bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white font-bold rounded-lg transition-all"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Step 3: Send Payment */}
        {step === 'send_payment' && (
          <div className="glass-dark rounded-xl p-6 mb-8 animate-fadeInUp">
            <div className="flex items-center gap-3 mb-4">
              <Send size={24} className="text-green-400" />
              <h2 className="text-xl font-bold text-white">Send Real TON Payment</h2>
            </div>
            <p className="text-dark-300 mb-6">Complete the payment using your connected Tonkeeper wallet</p>

            <div className="space-y-4 mb-6">
              {/* Sender Wallet (Company) */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Your Wallet Address (Sender)</label>
                <div className="bg-dark-800 border border-dark-700 rounded-lg p-3 flex items-center justify-between">
                  <p className="text-primary-300 font-mono text-xs break-all">{companyWallet || 'Not connected'}</p>
                  <button
                    onClick={handleCopyWallet}
                    className="flex-shrink-0 p-2 hover:bg-dark-700 rounded transition-all"
                  >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-primary-400" />}
                  </button>
                </div>
              </div>

              {/* Recipient Wallet (Candidate) */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Candidate Wallet Address (Recipient)</label>
                <input
                  type="text"
                  value={candidateWallet}
                  onChange={(e) => setCandidateWallet(e.target.value)}
                  placeholder="UQDx... or 0:..."
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                />
                <p className="text-dark-400 text-xs mt-1">Enter the candidate's TON wallet address</p>
              </div>

              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 p-4 rounded-lg">
                <p className="text-dark-400 text-sm mb-3">Payment Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Amount:</span>
                    <span className="text-2xl font-bold gradient-text">{escrow?.amount} {escrow?.currency}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-dark-400">Network:</span>
                    <span className="text-primary-300 font-bold">TON Blockchain</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-dark-400">Status:</span>
                    <span className="text-yellow-300 font-bold">Ready to Send</span>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <p className="text-blue-300 text-sm">
                  ℹ️ When you click "Send Payment", Tonkeeper will open to confirm the transaction. Review the details and approve to complete the payment on the TON blockchain.
                </p>
              </div>
            </div>

            <button
              onClick={handleSendPayment}
              disabled={submitting || !candidateWallet}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {submitting ? 'Processing Transaction...' : 'Send Payment via Tonkeeper'}
            </button>
          </div>
        )}

        {/* Step 4: Completed */}
        {step === 'completed' && (
          <div className="glass-dark rounded-xl p-6 mb-8 animate-fadeInUp">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Payment Sent Successfully! 🎉</h2>
              <p className="text-dark-300 mb-6">Your payment has been sent to the candidate via the TON blockchain</p>

              {payment && (
                <div className="space-y-4 mb-6">
                  {/* Transaction Details */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 p-4 rounded-lg text-left">
                    <p className="text-green-300 font-bold mb-3">✓ Transaction Details</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-dark-400 text-xs mb-1">Amount Sent</p>
                        <p className="text-white font-bold text-lg">{payment.amount} {payment.currency}</p>
                      </div>

                      <div>
                        <p className="text-dark-400 text-xs mb-1">Sender Wallet (Your Address)</p>
                        <div className="bg-dark-800/50 p-2 rounded flex items-center justify-between">
                          <p className="text-primary-300 font-mono text-xs break-all">{companyWallet}</p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(companyWallet);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="flex-shrink-0 p-1 hover:bg-dark-700 rounded transition-all"
                          >
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-primary-400" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-dark-400 text-xs mb-1">Recipient Wallet (Candidate Address)</p>
                        <div className="bg-dark-800/50 p-2 rounded">
                          <p className="text-primary-300 font-mono text-xs break-all">{payment.candidateWalletAddress}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-dark-400 text-xs mb-1">Transaction Hash</p>
                        <div className="bg-dark-800/50 p-2 rounded">
                          <p className="text-accent-300 font-mono text-xs break-all">{payment.transactionHash}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-dark-400 text-xs mb-1">Network</p>
                        <p className="text-white font-bold">TON Blockchain</p>
                      </div>

                      <div>
                        <p className="text-dark-400 text-xs mb-1">Sent At</p>
                        <p className="text-white font-bold">{new Date(payment.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      ℹ️ The transaction has been submitted to the TON blockchain. It may take a few moments to be confirmed. You can verify the transaction on <a href="https://tonscan.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">TONScan</a>.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => router.push('/applications')}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-lg transition-all"
              >
                Back to Applications
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
