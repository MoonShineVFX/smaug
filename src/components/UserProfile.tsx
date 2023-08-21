import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Button, Tooltip, IconButton, Typography, Paper, ClickAwayListener, Menu, MenuList, MenuItem, Box, TextField } from '@mui/material';
import { UserDisplayInfo } from '../libs/types';
import { OutLineButton } from './basic';


interface UserProfileProps {
  userProfile: UserDisplayInfo
  logoutHandler: () => void,
  children?: React.ReactNode
}

function UserProfile({ userProfile, logoutHandler, children }: UserProfileProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const open = Boolean(anchorEl);
  const { picture, name } = userProfile;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    logoutHandler()
    setAnchorEl(null);
  };


  const LoggedInMenu = () => {
    return (
      <Menu
        open={open}
        autoFocus={true}
        anchorEl={anchorEl}
        id="logined-menu"
        aria-labelledby="logined-button"
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem> */}
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    )
  }


  return (
    <>
      {/* <OutLineButton></OutLineButton> */}
      <Tooltip title="Account infomation">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ borderRadius: 1 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="menu"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 36, height: 36, m: 1 }} src={picture}></Avatar>{name}
        </IconButton>
      </Tooltip>
      <LoggedInMenu />
    </>
  );
}

export default UserProfile;
