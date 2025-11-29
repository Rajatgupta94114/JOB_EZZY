'use client';

import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32 md:pb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 animate-fadeInUp">
          <Trophy size={32} className="text-accent-400" />
          <span className="gradient-text">Leaderboard</span>
        </h1>
        <p className="text-dark-300 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          Top recruiters by reputation and placements
        </p>

        <div className="glass-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-dark-800/50 hover:bg-dark-800 transition-all border border-white/5 hover:border-primary-500/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center font-bold text-dark-950">
                    {i === 1 ? '🥇' : i === 2 ? '🥈' : i === 3 ? '🥉' : i}
                  </div>
                  <div>
                    <p className="font-bold text-white">Recruiter {i}</p>
                    <p className="text-sm text-dark-400">{100 - i * 5} successful placements</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-400">{500 - i * 30}</p>
                  <p className="text-xs text-dark-400">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
