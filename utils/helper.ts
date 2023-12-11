import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  CandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import { publicKey } from '@metaplex-foundation/umi';
import axios from 'axios';

const candyMachineId = '6C5AeSViNzw5mQxTN1HGbort5QmKMtUyjZxQMJYBwQ5S';

export const checkCandyMachine = async () => {
  try {
    const res = await axios.get('/api/rpc');
    const { RPC } = res.data;
    if (!RPC || !candyMachineId) {
      return;
    }
    const umi = createUmi(RPC);
    const candyMachine: CandyMachine = await fetchCandyMachine(
      umi,
      publicKey(candyMachineId)
    );

    return candyMachine;
  } catch (error) {
    console.error('No RPC');
  }
};
