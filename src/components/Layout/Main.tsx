import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Header from '../Header';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';

import List from '@mui/material/List';
import { MainListItems, TagListItems } from '../listItems';


import NextLink from 'next/link'
import { Link as MUILink } from '@mui/material';
// import useSWR from "swr";
import { MenuListItem } from '../../libs/types';
import { trpc } from '../../utils/trpc';

const drawerWidth: number = 240;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

// const fetcher = (url: string) => fetch(url).then((r) => r.json());
const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open', })<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);


export default function Main({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuListQry = trpc.menus.all.useQuery();
  if (menuListQry.isLoading || !menuListQry.isSuccess) return <div>Loading</div>
  if (menuListQry.error) return <div>Error</div>
  console.log(menuListQry.data.menus)


  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open} sx={{ boxShadow: 'none' }}>
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
            bgcolor: '#2F2F2F'
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Header />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} sx={{ height: '100vh' }}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1,

          }}
        >
          {/* <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton> */}
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            sx={{ flexGrow: 1 }}
          >
            {/* <Link href="/" style={{ textDecoration: 'none', color:'white' }}>
                SMAUG
              </Link> */}
            <NextLink href='/' passHref style={{ textDecoration: 'none' }}>
              <MUILink variant="body2" underline="none" sx={{ transition: '.3s', color: 'white', fontSize: '1.3rem', fontWeight: 'bold', "&:hover": { color: '#eee', letterSpacing: '1px' } }} >SMAUG</MUILink>
            </NextLink>
          </Typography>

        </Toolbar>
        <Divider />

        <List component="nav" >
          {
            menuListQry.data.menus.map((item: MenuListItem, index) => {
              const { id, name } = item
              return name === 'Tags' ? <TagListItems key={index} mainMenuData={item} /> : <MainListItems key={index} mainMenuData={item} />

            })
          }
          {/* {Object.keys(mainListItem).length > 0  ?  <MainListItems  data={mainListItem} /> : <><LinearProgress /></>} */}
          {/* <TagListItems /> */}
          {/* <MemberListItems /> */}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : '#242424',
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}