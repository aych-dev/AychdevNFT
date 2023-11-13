import dynamic from 'next/dynamic';
import { Umi } from '@metaplex-foundation/umi';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import {
  CandyMachine,
  CandyGuard,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const useCandyMachine = (
  umi: Umi,
  candyMachineId: string,
  checkEligibility: boolean,
  setCheckEligibility: Dispatch<SetStateAction<boolean>>
) => {
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [candyGuard, setCandyGuard] = useState<CandyGuard>();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      if (checkEligibility) {
        if (!candyMachineId) {
          console.error('No candy machine in .env!');
          if (!toast.isActive('no-cm')) {
            toast({
              id: 'no-cm',
              title: 'No candy machine in .env!',
              description: 'Add your candy machine address to the .env file!',
              status: 'error',
              duration: 999999,
              isClosable: true,
            });
          }
          return;
        }

        let candyMachine;
        try {
          candyMachine = await fetchCandyMachine(
            umi,
            publicKey(candyMachineId)
          );
        } catch (e) {
          console.error(e);
          toast({
            id: 'no-cm-found',
            title: 'The CM from .env is invalid',
            description: 'Are you using the correct environment?',
            status: 'error',
            duration: 999999,
            isClosable: true,
          });
        }
        setCandyMachine(candyMachine);
        if (!candyMachine) {
          return;
        }
        let candyGuard;
        try {
          candyGuard = await safeFetchCandyGuard(
            umi,
            candyMachine.mintAuthority
          );
        } catch (e) {
          console.error(e);
          toast({
            id: 'no-guard-found',
            title: 'No Candy Guard found!',
            description: 'Do you have one assigned?',
            status: 'error',
            duration: 999999,
            isClosable: true,
          });
        }
        if (!candyGuard) {
          return;
        }
        setCandyGuard(candyGuard);
        setCheckEligibility(false);
      }
    })();
  }, [umi, checkEligibility]);

  return { candyMachine, candyGuard };
};

export default function Home() {
  return (
    <main>
      <div className='flex items-center justify-center h-screen'>
        <div className='bg-gray-300 p-8 rounded'>
          <WalletMultiButtonDynamic />
        </div>
      </div>
    </main>
  );
}
