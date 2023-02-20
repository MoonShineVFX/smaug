import { ThemeOptions } from '@mui/material/styles';
import darkScrollbar from '@mui/material/darkScrollbar';
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: themeParam.palette.mode === 'dark' ? darkScrollbar() : null,
      }),
    },
  }
};

export default darkThemeOptions;