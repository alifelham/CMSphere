// /pages/_app.tsx

import type { AppProps } from 'next/app';
import '../styles/globals.css';  // Import the global CSS
import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* The header with the Optimizely logo at the top */}
      <Header />
      {/* The main content (your pages) */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
