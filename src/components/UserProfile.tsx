import Raect, { useState, useRef, useEffect } from 'react';
import { Avatar, Stack, Button,Tooltip,IconButton, Container, Popover, Typography, Popper, Grow, Paper, ClickAwayListener, Menu,MenuList, MenuItem, Box, TextField } from '@mui/material';
import { UserInfo } from '../libs/types';
import React from 'react';

interface UserProfileProps {
    props: {
        userProfile: UserInfo,
        setUserProfile: (user: UserInfo) => void,
        loginHandler: () => Promise<Response>
    },
    children?: React.ReactNode
}

function UserProfile(props: UserProfileProps): JSX.Element {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { userProfile, setUserProfile, loginHandler } = props.props;
    const [logginFeedback, setLogginFeedback] = useState<string>('');
    // const [open, setOpen] = useState(false);
    // const anchorRef = useRef<HTMLButtonElement | null>(null);

    // const handleToggle = (event: React.MouseEvent) => {
    //     console.log('button pressed')
    //     anchorRef.current = event.currentTarget as HTMLButtonElement;
    //     setOpen((prevOpen) => !prevOpen);
    // };

    // const handleClose = (event: Event | React.SyntheticEvent) => {
    //     if (
    //         anchorRef.current &&
    //         anchorRef.current.contains(event.target as HTMLElement)
    //     ) {
    //         return;
    //     }

    //     setOpen(false);
    // };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
						event.stopPropagation();
        } else if (event.key === 'Escape') {
            setAnchorEl(null);
        }
    };


    // const prevOpen = useRef(open);
    useEffect(() => {
        // if (prevOpen.current === true && open === false) {
        //     anchorRef.current!.focus();
        // }

        // prevOpen.current = open;
    }, [open]);

    const logProc = () => {
        console.log('logProc');
        loginHandler().then((res) => {
            if (res.status === 200) {
                res.json().then((payload) => {
                    const {msg, data} = payload;
                    console.log(data);
                    setUserProfile(data);
                    setAnchorEl(null);
                });
            } else {
                setLogginFeedback('Login failed');
            }
        }
        );
    }

    const Logged_menu = () =>{
        return(
            <Paper>
            <MenuList
                autoFocusItem={open}
                id="composition-menu"
                aria-labelledby="composition-button"
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </MenuList>
        </Paper>
        )
    }
        


    const Loggin_form = ()=>{
        return(
            <Paper
            sx={{ padding: 2 }}
            component="form"
            autoComplete="off"
						onKeyDown={handleListKeyDown}
        >
            <Stack spacing={2}>
                <TextField
                    id="username"
                    label="E-mail"
                    defaultValue=""
                    placeholder='email'
                />
                <TextField
                    id="password"
                    label="Password"
                    defaultValue=""
                    placeholder='password'
                />
                <Button
                    id='login'
                    onClick={logProc}>login</Button>
            </Stack>
        </Paper>
        )
    }
       

    
    return (
				<React.Fragment>
					{userProfile.id !== '' ?
						<Tooltip title="Account settings">
							<IconButton
							onClick={handleClick}
							size="small"
							sx={{ ml: 2 }}
							aria-controls={open ? 'account-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							>
									<Avatar sx={{ width: 48, height: 48, m: 1 }} src={userProfile.picture}></Avatar>    
							</IconButton>
						</Tooltip>
						:
						<Button
								sx={{ m: 0 }}
								id="basic-button"
								// ref={anchorRef}
								aria-controls={open ? 'basic-menu' : undefined}
								aria-expanded={open ? 'true' : undefined}
								aria-haspopup="true"
								onClick={handleClick}
								
						> Log-in</Button>
					}
						<Menu
							open={open}
							anchorEl={anchorEl}
							role={undefined}
							onClose={handleClose}
							
							id="basic-menu"
							MenuListProps={{
							'aria-labelledby': 'basic-button',
							}}
						>
							{userProfile.id !== '' ? <Logged_menu /> : <Loggin_form/>}
						</Menu>
        </React.Fragment>
    );
}

export default UserProfile;
