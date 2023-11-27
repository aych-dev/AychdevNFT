import { WalletContextState } from '@solana/wallet-adapter-react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import {
  mplCandyMachine,
  fetchCandyMachine,
  fetchCandyGuard,
  mintV2,
} from '@metaplex-foundation/mpl-candy-machine';
import {
  generateSigner,
  publicKey,
  transactionBuilder,
  some,
} from '@metaplex-foundation/umi';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';
import { sol } from '@metaplex-foundation/js';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';

const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const candyMachineId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID;

export const publicMint = async (
  wallet: WalletContextState,
  setIsMinting: Dispatch<SetStateAction<boolean>>
) => {
  if (!RPC || !candyMachineId) {
    console.error('No id');
    return;
  }

  setIsMinting(true);
  let toastPromise = toast.loading('Checking Your Wallet...', {
    theme: 'dark',
  });
  const umi = createUmi(RPC)
    .use(walletAdapterIdentity(wallet))
    .use(mplCandyMachine());
  const candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
  const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);
  const nftMint = generateSigner(umi);

  try {
    toast.update(toastPromise, {
      render: 'Minting...',
      type: 'info',
      autoClose: false,
      theme: 'dark',
      isLoading: true,
    });
    const tx = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        mintV2(umi, {
          candyMachine: candyMachine.publicKey,
          nftMint,
          collectionMint: candyMachine.collectionMint,
          tokenStandard: candyMachine.tokenStandard,
          candyGuard: candyGuard.publicKey,
          collectionUpdateAuthority: candyMachine.authority,
          mintArgs: {
            solPayment: some({
              lamports: sol(0.1),
              destination: publicKey(
                'E8nesKaD6AF61YJqDZs217guz2oSfN24ooaaZtuXGAo6'
              ),
            }),
          },
        })
      )
      .sendAndConfirm(umi);
    if (tx.result.value.err === null) {
      setIsMinting(false);
      toast.update(toastPromise, {
        render: 'Minted!',
        type: 'success',
        autoClose: 2000,
        theme: 'dark',
        isLoading: false,
      });
    }
  } catch (e) {
    setIsMinting(false);
    toast.update(toastPromise, {
      render: 'Error minting, please check wallet',
      type: 'error',
      autoClose: 2000,
      theme: 'dark',
      icon: '🔒',
      isLoading: false,
    });
  }
};
