import React, { useEffect, useState, useRef, RefObject } from "react";
import { Alert, Button, Paper, Popper, Snackbar, Stack, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import useSWR from "swr";
import { UserDisplayInfo } from "../libs/types";


const OutLineButton = styled(Button)(({ theme }) => ({
  color: "#bbb",
  borderColor: "#bbb",
  '&:hover': {
    backgroundColor: "#fff",
    color: "#000",
  },
}));

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

  const fetcher = (apiUrl: string, encodedAuthString: string | null) => fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedAuthString}`
    }
  }).then((res) => res.json());

  const apiUrl = '/api/login'
  const { data: userDisplayInfo, error, isLoading } = useSWR(
    encodedAuthString ? apiUrl : null,
    () => fetcher(apiUrl, encodedAuthString),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    });

  useEffect(
    () => {
      if (userDisplayInfo) {
        loginUser(userDisplayInfo);
        setOpenLoginDialog(false);
      }
    }
    , [userDisplayInfo]
  );
  useEffect(() => {
    if (error) {
      setIsErrorSnackbarOpen(true);
    }
  }, [error]);


  const loginHandler = () => {
    if (!(username && password)) {
      console.log('username and password are required');
      return;
    }
    const authString = `${username}:${password}`;
    const encodedAuthString = Buffer.from(authString).toString('base64');
    setEncodedAuthString(encodedAuthString)

  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsErrorSnackbarOpen(false);
  };

  return (
    <>
      {isLoading ?
        <><div>loading...</div></>
        :
        <><OutLineButton
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
              {error?.message || "An error occurred!"}
            </Alert>
          </Snackbar>
        </>
      }
    </>

  )
}