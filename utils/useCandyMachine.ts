import { WalletContextState } from '@solana/wallet-adapter-react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import {
  mplCandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import { publicKey } from '@metaplex-foundation/umi';

const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const candyMachineId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID;

export const useCandyMachine = async (wallet: WalletContextState) => {
  if (!candyMachineId || !RPC) {
    return;
  }

  const umi = createUmi(RPC)
    .use(walletAdapterIdentity(wallet))
    .use(mplCandyMachine());
  const candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
  return { candyMachine };
};
