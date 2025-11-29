'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Briefcase } from 'lucide-react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { showSplashScreen, setShowAuthModal, setShowSplashScreen } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // If splash screen is explicitly shown (e.g., after logout), show it
    if (showSplashScreen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowAuthModal(true);
        setShowSplashScreen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Initial splash screen on first load
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 300);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setShowAuthModal(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [mounted, showSplashScreen, setShowAuthModal, setShowSplashScreen]);

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex flex-col items-center justify-center z-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center">
        {/* Logo - Briefcase */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center animate-bounce" style={{ animationDelay: '0s' }}>
            <Briefcase size={48} className="text-white" />
          </div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.2s' }}>
            <Briefcase size={48} className="text-white" />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-center text-dark-300 text-sm mb-8 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          Decentralized Recruitment on TON
        </p>

        {/* Loading Bar */}
        <div className="w-96 h-2 bg-dark-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500 rounded-full animate-pulse"
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
