import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  return (
    <main>
      <div className='flex items-center justify-center h-screen'>
        <WalletMultiButton />
      </div>
    </main>
  );
}
