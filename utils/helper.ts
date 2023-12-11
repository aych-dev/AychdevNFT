import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  CandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import { publicKey } from '@metaplex-foundation/umi';
import axios from 'axios';

const candyMachineId = '6C5AeSViNzw5mQxTN1HGbort5QmKMtUyjZxQMJYBwQ5S';
const RPC = 'https://fancy-daphna-fast-mainnet.helius-rpc.com/';

export const checkCandyMachine = async () => {
  const umi = createUmi(RPC);
  const candyMachine: CandyMachine = await fetchCandyMachine(
    umi,
    publicKey(candyMachineId)
  );

  return candyMachine;
};
