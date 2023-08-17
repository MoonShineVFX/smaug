import Raect, { useState, useRef, useEffect } from 'react';
import { Avatar, Button, Tooltip, IconButton, Typography, Paper, ClickAwayListener, Menu, MenuList, MenuItem, Box, TextField } from '@mui/material';
import { UserDisplayInfo } from '../libs/types';
import { OutLineButton } from './basic';


interface UserProfileProps {
  userProfile: UserDisplayInfo
  logoutHandler: () => void,
  children?: React.ReactNode
}

function UserProfile({ userProfile, logoutHandler, children }: UserProfileProps): JSX.Element {
  const [anchorRef, setAnchorRef] = useState<null | HTMLButtonElement>(null);
  const open = Boolean(anchorRef);

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //     setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorRef(null);
  // };

  // function handleListKeyDown(event: React.KeyboardEvent) {
  //     if (event.key === 'Tab') {
  // 					event.stopPropagation();
  //     } else if (event.key === 'Escape') {
  //         setAnchorEl(null);
  //     }
  // };


  // const LoginedMenu = () => {
  //   return (
  //     <Paper>
  //       <MenuList
  //         autoFocusItem={open}
  //         id="composition-menu"
  //         aria-labelledby="composition-button"
  //       >
  //         <MenuItem onClick={handleClose}>Profile</MenuItem>
  //         <MenuItem onClick={handleClose}>My account</MenuItem>
  //         <MenuItem onClick={handleClose}>Logout</MenuItem>
  //       </MenuList>
  //     </Paper>
  //   )
  // }


  return (
    <>
      <OutLineButton> Sign-out</OutLineButton>
      <Tooltip title="Account infomation">
        <IconButton
          // onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="menu"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 48, height: 48, m: 1 }} src={userProfile.picture}>{userProfile.name}</Avatar>
        </IconButton>
      </Tooltip>
    </>
  );
}

export default UserProfile;
