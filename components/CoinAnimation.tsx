'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './CoinAnimation.module.css';

interface CoinAnimationProps {
  isVisible: boolean;
  direction: 'down' | 'up'; // down for candidate, up for company
  sbtAmount: number;
  onComplete?: () => void;
}

export default function CoinAnimation({ isVisible, direction, onComplete }: CoinAnimationProps) {
  const [coins, setCoins] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    if (!isVisible) return;

    // Create 20-30 coins with random delays
    const coinCount = Math.floor(Math.random() * 11) + 20; // 20-30 coins
    const newCoins = Array.from({ length: coinCount }, (_, i) => ({
      id: i,
      left: Math.random() * 90 + 5, // Random position 5-95%
      delay: Math.random() * 0.5, // Staggered start (0-0.5s)
    }));
    setCoins(newCoins);

    // Complete animation after 4 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-50`}>
      {coins.map((coin) => (
        <div
          key={coin.id}
          className={`absolute ${
            direction === 'down'
              ? styles.coinFallDown
              : styles.coinFallUp
          }`}
          style={{
            left: `${coin.left}%`,
            top: direction === 'down' ? '-60px' : 'calc(100% + 60px)',
            animationDelay: `${coin.delay}s`,
            width: '48px',
            height: '48px',
          }}
        >
          <Image
            src="/ton-coin.png"
            alt="TON Coin"
            width={48}
            height={48}
            className="w-full h-full object-contain drop-shadow-lg"
            priority
          />
        </div>
      ))}
    </div>
  );
}
