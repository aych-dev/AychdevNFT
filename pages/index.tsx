import dynamic from 'next/dynamic';
import { checkCandyMachine } from '@/utils/helper';
import { CandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { useEffect, useState } from 'react';
import Mint from '@/components/Mint';
import Image from 'next/image';
import AychDevNft from '../public/aychdevnft.png';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMinting, setIsMinting] = useState<boolean>(false);

  useEffect(() => {
    const fetchCandyMachine = async () => {
      const cm = await checkCandyMachine();
      setCandyMachine(cm);
      setIsLoading(false);
    };
    fetchCandyMachine();
  }, []);

  return (
    <main className='flex items-center justify-center h-screen mx-11'>
      <div className='bg-gray-300 rounded border shadow-xl min-w-full'>
        <div className='flex items-center justify-center'>
          <div className='mb-12 p-2'>
            <WalletMultiButtonDynamic />
          </div>
        </div>
        <div className='grid grid-col items-center justify-center'>
          <div className='p-2'>
            <Image src={AychDevNft} alt='aychdev' height={200} />
          </div>
          <h1 className='text-purple-800 font-bold font-serif text-3xl flex items-center justify-center'>
            AychNFT
          </h1>
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
    </main>
  );
}
