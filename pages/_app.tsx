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
import { useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import '@solana/wallet-adapter-react-ui/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import axios from 'axios';

export default function App({ Component, pageProps }: AppProps) {
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new AlphaWalletAdapter(),
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
    ],
    []
  );
  const [rpcEndpoint, setRpcEndpoint] = useState('');

  useEffect(() => {
    const fetchRpcEndpoint = async () => {
      try {
        const response = await axios.get('/api/rpc');
        const { RPC } = response.data;
        setRpcEndpoint(RPC);
      } catch (error) {
        console.error('Error fetching RPC endpoint:', error);
      }
    };
    fetchRpcEndpoint();
  }, []);

  if (!rpcEndpoint) {
    return (
      <>
        <main className='flex items-center justify-center h-screen mx-11'>
          <div className='bg-gray-300 rounded border shadow-xl min-w-full'>
            <div className='flex items-center justify-center'></div>
            <div className='grid grid-col items-center justify-center'>
              <span className='loading loading-ring loading-lg'></span>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <WalletProvider wallets={wallets}>
        <ConnectionProvider endpoint={rpcEndpoint}>
          <WalletModalProvider>
            <Component {...pageProps} />
          </WalletModalProvider>
        </ConnectionProvider>
      </WalletProvider>
      <ToastContainer position='top-center' />
    </>
  );
}
