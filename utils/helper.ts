import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  CandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import { publicKey } from '@metaplex-foundation/umi';

const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const candyMachineId = '6C5AeSViNzw5mQxTN1HGbort5QmKMtUyjZxQMJYBwQ5S';

export const checkCandyMachine = async () => {
  if (!RPC || !candyMachineId) {
    return;
  }
  const umi = createUmi(RPC);
  const candyMachine: CandyMachine = await fetchCandyMachine(
    umi,
    publicKey(candyMachineId)
  );

  return candyMachine;
};
