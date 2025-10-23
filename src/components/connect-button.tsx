'use client';

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

// ✅ Komponen tombol koneksi wallet
export function ConnectButton() {
  return (
    <div className="flex justify-center items-center ">
      <RainbowConnectButton
        chainStatus={{ smallScreen: 'none', largeScreen: 'icon' }}
        accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
        showBalance={{ smallScreen: false, largeScreen: true }}
      />
    </div>
  );
}