import '@mantine/core/styles.css';
import './globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { ApiKeyContextProvider } from '@/components/ApiKeyContextProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <ApiKeyContextProvider>
      <Head>
        <title>Ai</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
      </ApiKeyContextProvider>
    </MantineProvider>
  );
}
