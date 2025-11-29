'use client';

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={process.env.NEXT_PUBLIC_TON_CONNECT_MANIFEST || "https://jobezzy-omega.vercel.app"}>
      {children}
    </TonConnectUIProvider>
  );
}
