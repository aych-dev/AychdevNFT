import {
  WalletProvider,
  ConnectionProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  AlphaWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import '@/styles/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  if (!process.env.NEXT_PUBLIC_RPC_ENDPOINT) throw new Error('Missing RPC URL');

  const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT;

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new AlphaWalletAdapter(),
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
    ],
    []
  );
  return (
    <>
      <WalletProvider wallets={wallets}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletModalProvider>
            <Component {...pageProps} />
          </WalletModalProvider>
        </ConnectionProvider>
      </WalletProvider>
      <ToastContainer position='top-center' />
    </>
  );
}
