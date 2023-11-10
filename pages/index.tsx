import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  return (
    <main>
      <div className='flex items-center justify-center h-screen'>
        <div className='bg-gray-300 p-8 rounded'>
          <WalletMultiButton />
        </div>
      </div>
    </main>
  );
}
