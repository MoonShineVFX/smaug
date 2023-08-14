import { useContext } from 'react';

import { AuthContext } from '../context/authContext';
import UserProfile from './UserProfile';

function UserContainer ():JSX.Element {
    const authPros = useContext(AuthContext);

    if (!authPros) throw new Error('AuthContext is not defined');
    const {user, loginUser, logoutUser} = authPros;
    return (
        <>
            {user ? <UserProfile userProfile={user} logoutHandler={logoutUser} /> : <div>LOGIN COMPONENT</div>}
        </>
    )
}

export default UserContainer;