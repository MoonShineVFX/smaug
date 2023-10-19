import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import * as React from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Main from '../components/Layout/Main'
import createEmotionCache from '../utils/createEmotionCache';
import darkThemeOptions from '../styles/theme/darkThemeOptions';
import Head from 'next/head'
import { RecoilRoot } from 'recoil';
import { AuthProvider } from '../context/authContext';
import { trpc } from '../utils/trpc';

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;

}

const clientSideEmotionCache = createEmotionCache();


const darkTheme = createTheme(darkThemeOptions);
//MyApp主要用於設定nextjs 與 mui dark Theme 使之後的頁面都會套用到設定(like index, etc..)
const MyApp: React.FunctionComponent<MyAppProps> = (props: { Component: any; emotionCache?: EmotionCache | undefined; pageProps: any; }) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={darkTheme}>
        <RecoilRoot>
          <CssBaseline />
          <Head>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
            <meta property="og:site_name" content="SMAUG" />
            <meta property="og:image" content="/card.png" />
            <meta name="description" content="SMAUG Asset HomePage" />
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            <title>SMAUG</title>
          </Head>
          <AuthProvider>
            <Main>
              <Component {...pageProps} />
            </Main>
          </AuthProvider>
        </RecoilRoot>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default trpc.withTRPC(MyApp);