'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { User, Wallet, Shield, Award, ArrowLeft, LogOut, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [ratings, setRatings] = useState<any[]>([]);
  const [sbtBalance, setSbtBalance] = useState(0);

  useEffect(() => {
    if (user?.role === 'company') {
      fetchRatings();
    }
    fetchSBTBalance();
  }, [user?.id, user?.role]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/ratings?companyId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchSBTBalance = async () => {
    try {
      // Calculate SBT balance from payments (10 SBT per payment)
      const paymentsRes = await fetch(
        user?.role === 'company'
          ? `/api/payments?companyId=${user?.id}`
          : `/api/payments?candidateId=${user?.id}`
      );
      if (paymentsRes.ok) {
        const payments = await paymentsRes.json();
        const completedPayments = payments.filter((p: any) => p.status === 'completed');
        setSbtBalance(completedPayments.length * 10);
      }
    } catch (error) {
      console.error('Error fetching SBT balance:', error);
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" suppressHydrationWarning>
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-32 md:pb-8">
        <div className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-4 animate-fadeInUp">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-white/10 transition-all flex-shrink-0"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6 text-primary-400" />
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-2 sm:gap-3 truncate">
            <User size={24} className="sm:w-8 sm:h-8 text-primary-400 flex-shrink-0" />
            <span className="gradient-text truncate">Profile</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          {/* Profile Card */}
          <div className="md:col-span-1 glass-dark rounded-xl p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 mx-auto mb-4 flex items-center justify-center text-4xl">
                👤
              </div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-primary-400 capitalize font-medium">{user.role}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-dark-800/50">
                <p className="text-dark-400">Rating</p>
                <p className="text-xl font-bold text-primary-400">⭐ {user.rating}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                <p className="text-dark-400">SBT Balance</p>
                <p className="text-2xl font-bold text-yellow-400">{sbtBalance} SBT</p>
                <p className="text-xs text-dark-300 mt-1">Soulbound Tokens</p>
              </div>
              <div className="p-3 rounded-lg bg-dark-800/50">
                <p className="text-dark-400">KYC Status</p>
                <p className={`text-sm font-bold capitalize ${
                  user.kycStatus === 'verified' ? 'text-green-400' :
                  user.kycStatus === 'rejected' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {user.kycStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Wallet Info */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Wallet size={20} className="text-primary-400" />
                Wallet Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-dark-400 text-sm">TON Wallet Address</p>
                  <p className="text-white font-mono text-sm break-all">{user.walletAddress}</p>
                </div>
                {user.telegramId && (
                  <div>
                    <p className="text-dark-400 text-sm">Telegram ID</p>
                    <p className="text-white">{user.telegramId}</p>
                  </div>
                )}
                {user.tonDNS && (
                  <div>
                    <p className="text-dark-400 text-sm">TON DNS</p>
                    <p className="text-white">{user.tonDNS}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Credentials */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award size={20} className="text-accent-400" />
                Credentials & Badges
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-xs text-dark-400 capitalize">{user.role}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-lg">
                    ✓
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings Section - Only for Companies */}
            {user.role === 'company' && (
              <div className="glass-dark rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Star size={20} className="text-yellow-400" />
                  Ratings from Candidates
                </h3>
                {ratings.length > 0 ? (
                  <div className="space-y-3">
                    {ratings.map((rating: any) => (
                      <div key={rating.id} className="p-4 rounded-lg bg-dark-800/50 border border-dark-700">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < rating.rating ? 'text-yellow-400' : 'text-dark-600'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-dark-400">{new Date(rating.createdAt).toLocaleDateString()}</span>
                        </div>
                        {rating.comment && (
                          <p className="text-sm text-dark-300">{rating.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-400 text-sm">No ratings yet. Complete payments to receive ratings from candidates.</p>
                )}
              </div>
            )}

            {/* KYC Verification */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield size={20} className="text-blue-400" />
                KYC Verification
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-dark-800/50">
                  <p className="text-sm text-dark-400 mb-2">Status:</p>
                  <p className={`text-sm font-bold capitalize ${
                    user.kycStatus === 'verified' ? 'text-green-400' :
                    user.kycStatus === 'rejected' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {user.kycStatus}
                  </p>
                </div>
                {user.kycStatus !== 'verified' && (
                  <Link
                    href="/kyc"
                    className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-lg transition-all text-sm font-medium text-center block"
                  >
                    Complete KYC
                  </Link>
                )}
              </div>
            </div>

            {/* Security */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield size={20} className="text-green-400" />
                Security
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-all text-sm font-medium">
                  Change Password
                </button>
                <button className="w-full px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-all text-sm font-medium">
                  Enable 2FA
                </button>
                <button className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all text-sm font-medium">
                  Disconnect Wallet
                </button>
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
