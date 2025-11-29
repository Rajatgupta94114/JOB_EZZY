'use client';

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // Use localhost for development, production URL for deployment
  const manifestUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000/tonconnect-manifest.json'
    : (process.env.NEXT_PUBLIC_TON_CONNECT_MANIFEST || "https://jobezzy-omega.vercel.app/tonconnect-manifest.json");

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
