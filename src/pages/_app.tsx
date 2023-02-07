import * as React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Main from '../components/Layout/Main'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import createEmotionCache from '../utility/createEmotionCache';
import darkThemeOptions from '../styles/theme/darkThemeOptions';
import '../styles/globals.css';
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
        <CssBaseline />
        <Main>
          <Component {...pageProps} />
        </Main>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;