import React from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/PagesAuthContext';
import '../src/app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;