import { AppProps } from 'next/app';
import '../styles/globals.css';
import Wallet from '@/component/WalletProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Wallet>
      <Component {...pageProps} />
    </Wallet>
  );
}

export default MyApp;
