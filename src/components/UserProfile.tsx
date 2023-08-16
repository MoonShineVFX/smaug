import Raect, { useState, useRef, useEffect } from 'react';
import { Avatar, Stack, Button, Tooltip, IconButton, Container, Popover, Typography, Popper, Grow, Paper, ClickAwayListener, Menu, MenuList, MenuItem, Box, TextField } from '@mui/material';
import { UserDisplayInfo } from '../libs/types';
import React from 'react';

interface UserProfileProps {
  userProfile: UserDisplayInfo
  logoutHandler: () => void,
  children?: React.ReactNode
}

function UserProfile({ userProfile, logoutHandler, children }: UserProfileProps): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //     setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //     setAnchorEl(null);
  // };

  // function handleListKeyDown(event: React.KeyboardEvent) {
  //     if (event.key === 'Tab') {
  // 					event.stopPropagation();
  //     } else if (event.key === 'Escape') {
  //         setAnchorEl(null);
  //     }
  // };


  // const Logged_menu = () =>{
  //     return(
  //         <Paper>
  //         <MenuList
  //             autoFocusItem={open}
  //             id="composition-menu"
  //             aria-labelledby="composition-button"
  //         >
  //             <MenuItem onClick={handleClose}>Profile</MenuItem>
  //             <MenuItem onClick={handleClose}>My account</MenuItem>
  //             <MenuItem onClick={handleClose}>Logout</MenuItem>
  //         </MenuList>
  //     </Paper>
  //     )
  // }


  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <IconButton
          // onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 48, height: 48, m: 1 }} src={userProfile.picture}>{userProfile.name}</Avatar>
        </IconButton>
      </Tooltip>

      <Button
        sx={{ m: 0 }}
        id="basic-button"
        // ref={anchorRef}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={logoutHandler}

      > Log-out</Button>

      {/* <Menu
                open={open}
                anchorEl={anchorEl}
                role={undefined}
                onClose={handleClose}

                id="basic-menu"
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {userProfile.id !== '' ? <Logged_menu /> : <Loggin_form />}
            </Menu> */}
    </React.Fragment>
  );
}

export default UserProfile;
