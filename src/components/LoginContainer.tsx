import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import UserProfile from './UserProfile';
import LoginComponent from './LoginComponent';
import { getAuthCookie } from '../libs/client/login';
import { trpc } from "../utils/trpc";

function LoginContainer(): JSX.Element {
  const authPros = useContext(AuthContext);
  const { user, loginUser, logoutUser } = authPros;
  const userByTokenQry = trpc.auth.userByToken.useQuery();

  useEffect(() => {
    const token = getAuthCookie();
    console.log('LoginContainer token', token);
    if (token && userByTokenQry.data?.user !== undefined) {
      loginUser(userByTokenQry.data.user);
    }
  }, [userByTokenQry.data]);

  return (
    <>
      {user ? <UserProfile userProfile={user} logoutHandler={logoutUser} /> : <LoginComponent loginUser={loginUser} />}
    </>
  )
}

export default LoginContainer;