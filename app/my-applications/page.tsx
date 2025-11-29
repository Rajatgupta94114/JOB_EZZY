'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowLeft, CheckCircle, Clock, XCircle, Building2, FileText, Download, CreditCard } from 'lucide-react';

interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  resume: {
    fileName: string;
    fileData: string;
    fileType: string;
  };
  details: {
    fullName: string;
    email: string;
    phone: string;
    experience: string;
    coverLetter: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  escrowContractId: string | null;
  contractAccepted?: boolean;
  contractAcceptedAt?: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'candidate') {
      fetchData();
      
      // Auto-refresh every 5 seconds to check for company acceptance
      const interval = setInterval(() => {
        fetchData();
      }, 5000);
      
      return () => clearInterval(interval);
    }
    return undefined;
  }, [user]);

  const fetchData = async () => {
    try {
      const [appsRes, jobsRes, escrowRes, paymentsRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/jobs'),
        fetch('/api/escrow'),
        fetch(`/api/payments?candidateId=${user?.id}`),
      ]);

      if (appsRes.ok && jobsRes.ok && escrowRes.ok && paymentsRes.ok) {
        const allApps = await appsRes.json();
        const allJobs = await jobsRes.json();
        const allEscrows = await escrowRes.json();
        const allPayments = await paymentsRes.json();

        // Filter applications for this candidate
        const candidateApps = allApps.filter(
          (app: Application) => app.candidateId === user?.id
        );

        setApplications(candidateApps);
        setJobs(allJobs);
        setEscrows(allEscrows);
        setPayments(allPayments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getJobDetails = (jobId: string) => {
    return jobs.find(j => j.id === jobId);
  };

  const getEscrowDetails = (escrowId: string) => {
    return escrows.find(e => e.id === escrowId);
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = end.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return Math.max(0, days);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'accepted':
        return 'bg-green-500/20 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-dark-700 text-dark-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} />;
      case 'accepted':
        return <CheckCircle size={20} />;
      case 'rejected':
        return <XCircle size={20} />;
      default:
        return null;
    }
  };

  if (!isAuthenticated || !user) return null;

  if (user.role !== 'candidate') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
          <p className="text-dark-300">Only candidates can view applications</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" suppressHydrationWarning>
      <Navigation />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-32 md:pb-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4 animate-fadeInUp">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={24} className="text-primary-400" />
          </button>
          <div>
            <h1 className="text-4xl font-bold gradient-text">My Applications</h1>
            <p className="text-dark-300 mt-2">Track your job applications and their status</p>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="glass-dark rounded-xl p-12 text-center">
            <p className="text-dark-400">Loading applications...</p>
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {applications.map(app => {
              const job = getJobDetails(app.jobId);
              return (
                <div key={app.id} className="glass-dark rounded-xl p-6 hover:border-primary-500/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 size={20} className="text-primary-400" />
                        <h3 className="text-2xl font-bold text-white">{job?.company || 'Unknown Company'}</h3>
                      </div>
                      <p className="text-lg text-primary-300 mb-2">{job?.title || 'Unknown Position'}</p>
                      <div className="flex gap-4 text-sm text-dark-300">
                        <span>📍 {job?.location || 'N/A'}</span>
                        <span>💰 {job?.salary || 'N/A'} TON</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold capitalize ${
                      app.contractAccepted ? 'bg-green-500/20 text-green-300' : getStatusColor(app.status)
                    }`}>
                      {app.contractAccepted ? <CheckCircle size={16} /> : getStatusIcon(app.status)}
                      {app.contractAccepted ? 'Hired' : app.status}
                    </div>
                  </div>

                  <div className="border-t border-dark-700 pt-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
                      <div className="bg-dark-800/30 p-2 sm:p-3 rounded">
                        <p className="text-dark-400 text-xs">Applied On</p>
                        <p className="text-white font-bold truncate">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-dark-800/30 p-2 sm:p-3 rounded">
                        <p className="text-dark-400 text-xs">Your Email</p>
                        <p className="text-white font-bold truncate text-xs sm:text-sm">{app.details.email}</p>
                      </div>
                      <div className="bg-dark-800/30 p-2 sm:p-3 rounded">
                        <p className="text-dark-400 text-xs">Experience</p>
                        <p className="text-white font-bold">{app.details.experience || 'N/A'}</p>
                      </div>
                      {app.status === 'accepted' && app.escrowContractId && (
                        <div className="bg-dark-800/30 p-2 sm:p-3 rounded">
                          <p className="text-dark-400 text-xs">Escrow</p>
                          <p className="text-green-400 font-bold text-xs truncate">{app.escrowContractId.slice(0, 8)}...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {app.details.coverLetter && (
                    <div className="mt-4 p-4 bg-dark-800/50 rounded-lg">
                      <p className="text-sm text-dark-400 mb-2">Your Cover Letter:</p>
                      <p className="text-dark-300 text-sm line-clamp-3">{app.details.coverLetter}</p>
                    </div>
                  )}

                  {app.status === 'accepted' && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      {app.escrowContractId && !app.contractAccepted ? (
                        <>
                          <p className="text-green-300 font-bold">📋 Please accept this contract for selection</p>
                          <p className="text-green-300 text-sm mt-2">Review the contract details and click accept to proceed with this opportunity.</p>
                          <div className="mt-3 flex gap-2 flex-wrap">
                            <button
                              onClick={() => router.push(`/escrow-view/${app.escrowContractId}`)}
                              className="flex-1 py-2 px-4 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-bold"
                            >
                              <FileText size={16} />
                              View Contract
                            </button>
                            <button
                              onClick={() => {
                                const element = document.createElement('a');
                                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Contract details'));
                                element.setAttribute('download', `contract_${app.escrowContractId}.txt`);
                                element.style.display = 'none';
                                document.body.appendChild(element);
                                element.click();
                                document.body.removeChild(element);
                              }}
                              className="flex-1 py-2 px-4 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-bold"
                            >
                              <Download size={16} />
                              Download
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  // Update application to mark contract as accepted
                                  const response = await fetch('/api/applications', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      id: app.id,
                                      contractAccepted: true,
                                      contractAcceptedAt: new Date().toISOString(),
                                    }),
                                  });

                                  if (response.ok) {
                                    // Update escrow contract status to confirmed
                                    await fetch('/api/escrow', {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        id: app.escrowContractId,
                                        confirmationStatus: 'confirmed',
                                      }),
                                    });

                                    alert('Contract accepted! You are now hired.');
                                    // Refresh data instead of full page reload
                                    fetchData();
                                  }
                                } catch (error) {
                                  console.error('Error accepting contract:', error);
                                  alert('Failed to accept contract');
                                }
                              }}
                              className="flex-1 py-2 px-4 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-bold"
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() => router.push(`/escrow-view/${app.escrowContractId}`)}
                              className="flex-1 py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-bold"
                            >
                              ✗ Reject
                            </button>
                          </div>
                        </>
                      ) : app.contractAccepted ? (
                        <>
                          <p className="text-green-300 font-bold mb-4">✓ Congratulations! You have been hired.</p>
                          {app.escrowContractId && (() => {
                            const escrow = getEscrowDetails(app.escrowContractId);
                            return escrow ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                  <div className="bg-dark-800/50 p-3 rounded-lg">
                                    <p className="text-dark-400 text-xs">Start Date</p>
                                    <p className="text-white font-bold">{new Date(escrow.startDate).toLocaleDateString()}</p>
                                  </div>
                                  <div className="bg-dark-800/50 p-3 rounded-lg">
                                    <p className="text-dark-400 text-xs">End Date</p>
                                    <p className="text-white font-bold">{new Date(escrow.endDate).toLocaleDateString()}</p>
                                  </div>
                                  <div className="bg-dark-800/50 p-3 rounded-lg">
                                    <p className="text-dark-400 text-xs">Days Left</p>
                                    <p className="text-white font-bold">{calculateDaysRemaining(escrow.endDate)} days</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    const element = document.createElement('a');
                                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Contract Details\n\nJob: ${escrow.jobTitle}\nAmount: ${escrow.amount} ${escrow.currency}\nStart: ${new Date(escrow.startDate).toLocaleDateString()}\nEnd: ${new Date(escrow.endDate).toLocaleDateString()}\n\nDescription: ${escrow.description}\n\nTerms: ${escrow.terms}`));
                                    element.setAttribute('download', `contract_${escrow.id}.txt`);
                                    element.style.display = 'none';
                                    document.body.appendChild(element);
                                    element.click();
                                    document.body.removeChild(element);
                                  }}
                                  className="w-full py-2 px-4 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-bold"
                                >
                                  <Download size={16} />
                                  Download Contract
                                </button>

                                {/* Payment History */}
                                {(() => {
                                  const escrowPayments = payments.filter(p => p.escrowId === escrow.id);
                                  return escrowPayments.length > 0 ? (
                                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                      <div className="flex items-center gap-2 mb-3">
                                        <CreditCard size={18} className="text-green-400" />
                                        <h4 className="font-bold text-green-300">Payment Received</h4>
                                      </div>
                                      {escrowPayments.map(payment => (
                                        <div key={payment.id} className="bg-dark-800/50 p-3 rounded-lg">
                                          <div className="flex justify-between items-center mb-2">
                                            <span className="text-white font-bold">{payment.amount} {payment.currency}</span>
                                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Completed</span>
                                          </div>
                                          <p className="text-dark-400 text-xs mb-2">Transaction: {payment.transactionHash?.slice(0, 16)}...</p>
                                          <p className="text-dark-400 text-xs">Received: {new Date(payment.updatedAt).toLocaleString()}</p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            ) : null;
                          })()}
                        </>
                      ) : (
                        <p className="text-green-300 font-bold">✓ Congratulations! Your application has been accepted.</p>
                      )}
                    </div>
                  )}

                  {app.status === 'rejected' && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-300 font-bold">✗ Your application was not selected.</p>
                      <p className="text-red-300 text-sm mt-2">Keep applying to other positions!</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-dark rounded-xl p-12 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <Building2 size={48} className="mx-auto mb-4 text-dark-500" />
            <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
            <p className="text-dark-400 mb-6">Start applying to jobs to see them here</p>
            <button
              onClick={() => router.push('/jobs')}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-lg transition-all"
            >
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
