import { useEffect, useState, useRef } from "react";
import { Button, Dialog, Paper, Stack, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import useSWR from "swr";
import { UserDisplayInfo } from "../libs/types";


const SignInButton = styled(Button)(({ theme }) => ({
  color: "#bbb",
  borderColor: "#bbb",
  '&:hover': {
    backgroundColor: "#fff",
    color: "#000",
  },
}));

interface LoginComponentProps {
  loginUser: (user: UserDisplayInfo) => void;
}

export default function LoginComponent({ loginUser }: LoginComponentProps): JSX.Element {

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [encodedAuthString, setEncodedAuthString] = useState<string | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const fetcher = (url: string, encodedAuthString: string) => fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedAuthString}`
    }
  }).then((res) => res.json());

  const { data: userDisplayInfo, error, isLoading } = useSWR(encodedAuthString ? ['/api/login', encodedAuthString] : null, fetcher);

  const loginHandler = () => {
    const authString = `${username}:${password}`;
    const encodedAuthString = Buffer.from(authString).toString('base64');
    setEncodedAuthString(encodedAuthString)

  };

  useEffect(
    () => {
      if (userDisplayInfo) {
        loginUser(userDisplayInfo);
        setOpenLoginDialog(false);
      }
    }
    , [userDisplayInfo]
  );

  const Loggin_Dialog = () => {
    return (
      <Popper
        open={openLoginDialog}
        anchorEl={anchorRef.current}
      >
        <Paper
          sx={{ padding: 2 }}
          component="form"
          autoComplete="off"
        // onKeyDown={handleListKeyDown}
        >
          <Stack spacing={2}>
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
            <Button
              id='login'
              onClick={loginHandler}
            >
              login
            </Button>
          </Stack>
        </Paper>
      </Popper>
    )
  }

  return (
    <>
      <SignInButton
        onClick={ setOpenLoginDialog((prevOpen) => !prevOpen)}
        variant="outlined">Sign In
      </SignInButton>
    </>
  )
}