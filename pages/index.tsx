import dynamic from 'next/dynamic';
import { Umi, publicKey, PublicKey } from '@metaplex-foundation/umi';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import {
  CandyMachine,
  CandyGuard,
  fetchCandyMachine,
  safeFetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine';
import { toast } from 'react-toastify';
import { useUmi } from '@/utils/useUmi';
import {
  JsonMetadata,
  DigitalAssetWithToken,
} from '@metaplex-foundation/mpl-token-metadata';
import { GuardReturn } from '@/utils/checkerHelper';

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

  useEffect(() => {
    (async () => {
      if (checkEligibility) {
        let toastPromise = toast('Checking for CM');
        if (!candyMachineId) {
          console.error('No candy machine in .env!');
          toast.update(toastPromise, {
            render: 'No Candy Machine found',
            type: 'error',
            autoClose: 2000,
            theme: 'dark',
            icon: '🔒',
            isLoading: false,
          });
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
          toast.update(toastPromise, {
            render: 'No Candy Machine found',
            type: 'error',
            autoClose: 2000,
            theme: 'dark',
            icon: '🔒',
            isLoading: false,
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
          toast.update(toastPromise, {
            render: 'No Candy Guard found',
            type: 'error',
            autoClose: 2000,
            theme: 'dark',
            icon: '🔒',
            isLoading: false,
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
  const umi = useUmi();
  const [mintsCreated, setMintsCreated] = useState<
    | { mint: PublicKey; offChainMetadata: JsonMetadata | undefined }[]
    | undefined
  >();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [ownedTokens, setOwnedTokens] = useState<DigitalAssetWithToken[]>();
  const [guards, setGuards] = useState<GuardReturn[]>([
    { label: 'startDefault', allowed: false },
  ]);
  const [checkEligibility, setCheckEligibility] = useState<boolean>(true);

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
