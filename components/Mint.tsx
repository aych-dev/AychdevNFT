import React, { Dispatch, SetStateAction } from 'react';
import { publicMint } from '@/utils/publicMint';
import { useWallet } from '@solana/wallet-adapter-react';

interface MintProps {
  isMinting: boolean;
  setIsMinting: Dispatch<SetStateAction<boolean>>;
}

const Mint = ({ isMinting, setIsMinting }: MintProps) => {
  const wallet = useWallet();

  return (
    <div className='p-2 items-center justify-center flex'>
      {wallet.publicKey ? (
        <button className='btn  btn-primary' onClick={() => publicMint(wallet)}>
          Mint
        </button>
      ) : (
        <button disabled={true}>Connect Wallet</button>
      )}
    </div>
  );
};

export default Mint;
