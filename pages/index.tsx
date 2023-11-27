import dynamic from 'next/dynamic';
import { useCandyMachine } from '@/utils/helper';
import { CandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { useEffect, useState } from 'react';
import Mint from '@/components/Mint';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMinting, setIsMinting] = useState<boolean>(false);

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
            <Mint isMinting={isMinting} setIsMinting={setIsMinting} />
          </div>
        </div>
      </div>
    </main>
  );
}
