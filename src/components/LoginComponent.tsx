import React, { useEffect, useState, useRef, RefObject } from "react";
import { Alert, Paper, Popper, Snackbar, Stack, TextField } from "@mui/material";
import { trpc } from '../utils/trpc';
import { UserDisplayInfo } from "../libs/types";

import { OutLineButton } from "./basic";


interface LoginDialogProps {
  open: boolean;
  anchorRef: RefObject<HTMLButtonElement>;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  loginHandler: () => void;
}


const LogginDialog: React.FC<LoginDialogProps> = ({
  open,
  anchorRef,
  username,
  setUsername,
  password,
  setPassword,
  loginHandler
}) => {
  return (
    <Popper
      open={open}
      anchorEl={anchorRef ? anchorRef.current : undefined}
      placement="bottom-end"
    >
      <Paper
        sx={{ padding: 2 }}
        component="form"
        autoComplete="off"
      // onKeyDown={handleListKeyDown}
      >
        <Stack spacing={2} sx={{ paddingTop: '18px' }}>
          <TextField
            id="username"
            label="E-mail"
            defaultValue={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='email'
          />
          <TextField
            id="password"
            label="Password"
            defaultValue={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='password'
          />
          <OutLineButton
            id='login-button'
            onClick={loginHandler}
          >
            login
          </OutLineButton>
        </Stack>
      </Paper>
    </Popper>
  )
}


interface LoginComponentProps {
  loginUser: (user: UserDisplayInfo) => void;
}


export default function LoginComponent({ loginUser }: LoginComponentProps): JSX.Element {

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [encodedAuthString, setEncodedAuthString] = useState<string | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);

  const loginMutation = trpc.auth.login.useMutation();

  useEffect(
    () => {
      if (loginMutation.data) {
        loginUser(loginMutation.data.user);
        setOpenLoginDialog(false);
      }
    }
    , [loginMutation.data]
  );
  useEffect(() => {
    if (loginMutation.error) {
      setIsErrorSnackbarOpen(true);
    }
  }, [loginMutation.error]);


  const loginHandler = () => {
    if (!(username && password)) {
      console.log('username and password are required');
      return;
    }
    const authString = `${username}:${password}`;
    const encodedAuthString = Buffer.from(authString).toString('base64');
    loginMutation.mutate({ authorization: encodedAuthString })
    const user = loginMutation.data?.user;
    if (user) { loginUser(user); setOpenLoginDialog(false); }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsErrorSnackbarOpen(false);
  };

  return (

    loginMutation.isLoading ?
      <><div>loading...</div></>
      :
      <>
        <OutLineButton
          ref={anchorRef}
          onClick={() => { setOpenLoginDialog((prevOpen) => !prevOpen); }}
          variant="outlined">Sign In

        </OutLineButton>
        <LogginDialog
          open={openLoginDialog}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          loginHandler={loginHandler}
          anchorRef={anchorRef} />
        <Snackbar
          open={isErrorSnackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  // 顯示在頂部中央
        >
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {loginMutation.error?.message || "An error occurred!"}
          </Alert>
        </Snackbar>
      </>
  )
}