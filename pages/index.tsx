import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { publicMint } from '@/utils/helper';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const wallet = useWallet();
  const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT!;
  const connection = new Connection(RPC, 'confirmed');

  return (
    <main>
      <div className='flex items-center justify-center h-screen'>
        <div className='bg-gray-300 p-8 rounded'>
          <WalletMultiButtonDynamic />
          {wallet.publicKey ? (
            <button onClick={() => publicMint(wallet)}>Mint</button>
          ) : (
            <button>Connect Wallet</button>
          )}
        </div>
      </div>
    </main>
  );
}
