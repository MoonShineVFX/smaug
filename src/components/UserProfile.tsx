import Raect, { useState } from 'react';
import { Avatar, Button, Container, Popover, Typography } from '@mui/material';
import { UserInfo } from '../libs/common';


function UserProfile() {
    const [userProfile, setUserProfile] = useState<UserInfo>(
        {
            id: '',
            name: '',
            email: '',
            picture: ''
        });
    const showLoginForm = (event: React.MouseEvent) => {
        console.log(' show form is pressed')

    };

    if (userProfile.id == '') {
        return (<>
            <Avatar sx={{ width: 48, height: 48, m: 1 }}>N</Avatar>
            <Button onClick={showLoginForm}>Login</Button>
        </>)
    }
    else {
        return (<>
            <Avatar sx={{ width: 48, height: 48, m: 1 }} src={userProfile.picture}>
                {userProfile.name[0]}
            </Avatar>
            <Button> Logout</Button>
        </>)
    }
};


export default UserProfile;
