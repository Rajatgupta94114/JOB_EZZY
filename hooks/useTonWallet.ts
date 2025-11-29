import { useTonConnectUI } from '@tonconnect/ui-react';
import { useState, useEffect } from 'react';

export function useTonWallet() {
  const [tonConnectUI] = useTonConnectUI();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Monitor wallet connection status
  useEffect(() => {
    if (!tonConnectUI) return;

    // Check initial wallet state
    const checkWallet = () => {
      if (tonConnectUI.wallet?.account?.address) {
        setWalletAddress(tonConnectUI.wallet.account.address);
        setIsConnected(true);
      } else {
        setWalletAddress('');
        setIsConnected(false);
      }
    };

    checkWallet();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet?.account?.address) {
        setWalletAddress(wallet.account.address);
        setIsConnected(true);
      } else {
        setWalletAddress('');
        setIsConnected(false);
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI]);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // If wallet is already connected, just return
      if (tonConnectUI.wallet) {
        setWalletAddress(tonConnectUI.wallet.account.address);
        setIsConnected(true);
        return;
      }

      // Disconnect any existing connection first
      try {
        await tonConnectUI.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }

      // Open TonConnect modal to connect wallet
      await tonConnectUI.openModal();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await tonConnectUI.disconnect();
      setWalletAddress('');
      setIsConnected(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  return {
    walletAddress,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };
}
