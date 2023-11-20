import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  CandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import { publicKey } from '@metaplex-foundation/umi';

const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const candyMachineId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID;

export const useCandyMachine = async () => {
  if (!RPC || !candyMachineId) {
    console.log('No ID');
    return;
  }
  const umi = createUmi(RPC);
  const candyMachine: CandyMachine = await fetchCandyMachine(
    umi,
    publicKey(candyMachineId)
  );

  return { candyMachine };
};
