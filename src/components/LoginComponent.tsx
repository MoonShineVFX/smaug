import { Button, Paper, Stack, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import { UserDisplayInfo } from "../libs/types";
import { loginHandler } from "../libs/client/login";

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

  function logProc() {
    const usernameHtmlElement = document.getElementById('username') as HTMLInputElement;
    const passwordHtmlElement = document.getElementById('password') as HTMLInputElement;

    loginHandler(usernameHtmlElement.value, passwordHtmlElement.value).then((user) => {
      if (!user) {
        alert('login failed');
      }
      else { loginUser(user) };
    });
  }

  const Loggin_form = () => {
    return (
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
            onClick={logProc}
          >
            login
          </Button>
        </Stack>
      </Paper>
    )
  }

  return (
    <>
      <SignInButton variant="outlined">Sign In</SignInButton>
    </>
  )
}