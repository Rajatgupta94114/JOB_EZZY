'use client';

import { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useAuthStore } from '@/lib/store';
import { X, Wallet, Briefcase, Users } from 'lucide-react';

export default function AuthModal() {
  const [tonConnectUI] = useTonConnectUI();
  const { showAuthModal, setShowAuthModal, setUser, setIsLoading, selectedRole, setSelectedRole } = useAuthStore();
  const [username, setUsername] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);

  const handleTonConnect = async () => {
    if (!selectedRole) return;
    try {
      setIsLoading(true);
      await tonConnectUI.openModal();
      setWalletConnected(true);
    } catch (error) {
      console.error('TON Connect error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!selectedRole || !username.trim()) {
      alert('Please enter a username');
      return;
    }

    try {
      setIsLoading(true);
      
      const userRole: 'company' | 'candidate' = selectedRole === 'company' ? 'company' : 'candidate';
      const walletAddress = walletConnected ? (tonConnectUI.account?.address || null) : null;
      
      // Call API to create/get user
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          walletAddress,
          role: userRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const user = await response.json();
      
      console.log('Logged in user:', user);
      setUser(user);
      setShowAuthModal(false);
      setSelectedRole(null);
      setUsername('');
      setWalletConnected(false);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="glass-dark rounded-2xl w-full max-w-md overflow-hidden animate-slideInDown">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 flex items-center justify-center overflow-hidden">
          {/* Background animation */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              setShowAuthModal(false);
              setSelectedRole(null);
            }}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-white/20 rounded-full transition-all"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-2">
              <Briefcase size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome to JOBEZZY</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {!selectedRole ? (
            <>
              {/* Description */}
              <div className="space-y-3 text-sm text-dark-300">
                <div className="flex gap-3">
                  <span className="text-accent-400 text-lg">◆</span>
                  <p>Connect your TON wallet to access decentralized recruitment.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-accent-400 text-lg">◆</span>
                  <p>Earn SBT credentials and reputation on-chain.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-accent-400 text-lg">◆</span>
                  <p>Join the Web3 talent revolution.</p>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">Register as:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedRole('company')}
                    className="p-4 rounded-lg border border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/10 transition-all text-center"
                  >
                    <Briefcase size={24} className="mx-auto mb-2 text-primary-400" />
                    <p className="text-sm font-medium text-white">Company</p>
                  </button>
                  <button
                    onClick={() => setSelectedRole('candidate')}
                    className="p-4 rounded-lg border border-accent-500/30 hover:border-accent-500 hover:bg-accent-500/10 transition-all text-center"
                  >
                    <Users size={24} className="mx-auto mb-2 text-accent-400" />
                    <p className="text-sm font-medium text-white">Candidate</p>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Selected Role Display */}
              <div className="p-4 rounded-lg bg-dark-800/50 border border-primary-500/30">
                <p className="text-xs text-dark-400 mb-1">Registering as:</p>
                <p className="text-lg font-bold text-primary-400 capitalize">{selectedRole}</p>
              </div>

              {/* Username Input - Required */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">
                  Username <span className="text-accent-400">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                />
              </div>

              {/* Wallet Connection - Optional */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">Connect Wallet <span className="text-dark-400 text-xs">(Optional)</span></p>
                <button
                  onClick={handleTonConnect}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 ${
                    walletConnected
                      ? 'bg-green-500/20 border border-green-500 text-green-400'
                      : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white'
                  }`}
                >
                  <Wallet size={18} className="inline mr-2" />
                  {walletConnected ? '✓ Wallet Connected' : 'Connect TON Wallet'}
                </button>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={!username.trim()}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Login
              </button>

              {/* Back Button */}
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setUsername('');
                  setWalletConnected(false);
                }}
                className="w-full py-2 px-4 text-dark-300 hover:text-white text-sm font-medium transition-all"
              >
                ← Back to Role Selection
              </button>
            </>
          )}

          {/* Footer */}
          <p className="text-xs text-center text-dark-400">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
