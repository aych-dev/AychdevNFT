import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { publicMint } from '@/utils/publicMint';
import { useCandyMachine } from '@/utils/helper';
import { CandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { useEffect, useState } from 'react';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const wallet = useWallet();
  const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT!;
  const connection = new Connection(RPC, 'confirmed');
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  console.log(isLoading);
  useEffect(() => {
    const fetchCandyMachine = async () => {
      const cm = await useCandyMachine();
      setCandyMachine(cm);
      setIsLoading(false);
    };
    fetchCandyMachine();
  }, []);

  return (
    <main>
      <div className='items-center justify-center flex h-screen'>
        <div className='bg-gray-300 rounded p-60 relative'>
          <div className='flex items-center justify-center'>
            <div className='absolute top-0 mt-4'>
              <WalletMultiButtonDynamic />
            </div>
          </div>
          <div className='grid grid-col items-center justify-center'>
            <div className='flex items-center justify-center'>
              {isLoading ? (
                <div>
                  <span className='loading loading-spinner'></span>
                </div>
              ) : (
                <h1 className='text-purple-600 font-bold'>
                  NFTs Available:{' '}
                  <span className='font-bold text-black'>
                    {Number(candyMachine?.data?.itemsAvailable) -
                      Number(candyMachine?.itemsRedeemed)}
                  </span>
                </h1>
              )}
            </div>
            <div className='p-2 items-center justify-center flex'>
              {wallet.publicKey ? (
                <button
                  className='btn  btn-primary'
                  onClick={() => publicMint(wallet)}
                >
                  Mint
                </button>
              ) : (
                <button disabled={true}>Connect Wallet</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
