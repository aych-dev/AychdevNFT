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
  const umi = createUmi(RPC)
    .use(walletAdapterIdentity(wallet))
    .use(mplCandyMachine());
  const candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
  const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);
  const nftMint = generateSigner(umi);

  await transactionBuilder()
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
};
