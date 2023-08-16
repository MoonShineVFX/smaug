import { useContext } from 'react';

import { AuthContext } from '../context/authContext';
import UserProfile from './UserProfile';
import LoginComponent from './LoginComponent';

function LoginContainer(): JSX.Element {
  const authPros = useContext(AuthContext);
  const { user, loginUser, logoutUser } = authPros;
  return (
    <>
      {user ? <UserProfile userProfile={user} logoutHandler={logoutUser} /> : <LoginComponent loginUser={loginUser} />}
    </>
  )
}

export default LoginContainer;