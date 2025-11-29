'use client';

import { useEffect, useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import AuthModal from '@/components/AuthModal';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { Briefcase, Users, Award, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" suppressHydrationWarning>
      <SplashScreen />
      <AuthModal />

      {mounted && isAuthenticated && user ? (
        <>
          <Navigation />
          
          {/* Dashboard Content */}
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-32 md:pb-8">
            {/* Welcome Section */}
            <div className="mb-8 sm:mb-12 animate-fadeInUp">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
                Welcome back, <span className="gradient-text">{user.name}</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-dark-300 capitalize">
                {user.role === 'company' ? 'Manage your job postings and find top candidates' : 'Explore opportunities and grow your career'}
              </p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="glass-dark rounded-xl p-6 hover:border-primary-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Rating</p>
                    <p className="text-3xl font-bold text-primary-400">{user.rating}</p>
                  </div>
                  <Award className="text-primary-500 opacity-50" size={32} />
                </div>
              </div>

              <div className="glass-dark rounded-xl p-6 hover:border-accent-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Points Balance</p>
                    <p className="text-3xl font-bold text-accent-400">{user.pointsBalance}</p>
                  </div>
                  <Zap className="text-accent-500 opacity-50" size={32} />
                </div>
              </div>

              <div className="glass-dark rounded-xl p-6 hover:border-primary-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm">Role</p>
                    <p className="text-xl font-bold text-primary-300 capitalize">{user.role}</p>
                  </div>
                  <Users className="text-primary-500 opacity-50" size={32} />
                </div>
              </div>
            </div>

            {/* Role-Specific Content */}
            {user.role === 'company' ? (
              // Company Dashboard
              <div className="glass-dark rounded-xl p-8 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <Briefcase size={48} className="mx-auto mb-4 text-primary-400" />
                <h2 className="text-3xl font-bold mb-4">Manage Your Jobs</h2>
                <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
                  Post new job openings, review candidate applications, and build your team on the TON blockchain.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/jobs/create"
                    className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 inline-block"
                  >
                    + Add New Job
                  </Link>
                  <Link
                    href="/jobs"
                    className="px-8 py-3 border border-primary-500 text-primary-400 hover:bg-primary-500/10 font-bold rounded-lg transition-all inline-block"
                  >
                    View My Job List
                  </Link>
                </div>
              </div>
            ) : (
              // Candidate Dashboard
              <div className="glass-dark rounded-xl p-8 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <Briefcase size={48} className="mx-auto mb-4 text-accent-400" />
                <h2 className="text-3xl font-bold mb-4">Explore Opportunities</h2>
                <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
                  Browse available jobs, apply to positions, and build your professional reputation on the TON blockchain.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/jobs"
                    className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 inline-block"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    href="/profile"
                    className="px-8 py-3 border border-primary-500 text-primary-400 hover:bg-primary-500/10 font-bold rounded-lg transition-all inline-block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-dark-300">Loading...</p>
          </div>
        </div>
      )}
    </main>
  );
}
