import Raect, { useState, useRef, useEffect } from 'react';
import { Avatar, Stack, Button, Container, Popover, Typography, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, Box, TextField } from '@mui/material';
import { UserInfo } from '../libs/common';
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
    const { userProfile, setUserProfile, loginHandler } = props.props;
    const [logginFeedback, setLogginFeedback] = useState<string>('');
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement | null>(null);

    const handleToggle = (event: React.MouseEvent) => {
        console.log('button pressed')
        anchorRef.current = event.currentTarget as HTMLButtonElement;
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const logProc = () => {
        console.log('logProc');
        loginHandler().then((res) => {
            if (res.status === 200) {
                res.json().then((payload) => {
                    const {msg, data} = payload;
                    console.log(data);
                    setUserProfile(data);
                    setOpen(false);
                });
            } else {
                setLogginFeedback('Login failed');
            }
        }
        );
    }

    const logged_menu = (
        <Paper>
            <MenuList
                autoFocusItem={open}
                id="composition-menu"
                aria-labelledby="composition-button"
                onKeyDown={handleListKeyDown}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </MenuList>
        </Paper>
    );

    const loggin_form = (
        <Paper
            sx={{ padding: 2 }}
            component="form"
            autoComplete="off"
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
    return (
        <Stack direction="row" spacing={2}>
            <Avatar sx={{ width: 48, height: 48, m: 1 }}
                src={userProfile.picture}></Avatar>
            <Button
                sx={{ m: 0 }}
                ref={anchorRef}
                aria-controls={open ? 'composition-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >{userProfile.id === '' ? "log-in" : userProfile.name}</Button>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === "bottom-start" ? "left bottom" : "left top"
                        }}
                    >
                        {userProfile.id !== '' ? logged_menu : loggin_form}
                    </Grow>
                )}
            </Popper>
        </Stack>
    );
}

export default UserProfile;
