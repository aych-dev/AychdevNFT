import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { publicMint } from '@/utils/mint';
import { useCandyMachine } from '@/utils/helper';
import { CandyMachine } from '@metaplex-foundation/mpl-candy-machine';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const wallet = useWallet();
  const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT!;
  const connection = new Connection(RPC, 'confirmed');
  const candyMachine: CandyMachine = useCandyMachine();

  return (
    <main>
      <div className='flex items-center justify-center h-screen'>
        <div className='bg-gray-300 p-8 rounded'>
          <div>
            <h1>
              NFTs available:{' '}
              <span className='font-bold'>
                {Number(candyMachine?.data?.itemsAvailable) -
                  Number(candyMachine?.itemsRedeemed)}
              </span>
            </h1>
          </div>
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
