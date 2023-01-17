import { Container } from "@mui/system";
import React, { useState } from "react";
import { UserInfo } from "../libs/common";
import UserProfile from "./UserProfile";
import { loginHandler } from '../libs/client/login';

interface headProps {
    props?: any;
    children?: React.ReactNode;
}

export default function Header(props: headProps): JSX.Element {

    const [userProfile, setUserProfile] = useState<UserInfo>(
        {
            id: '',
            name: '',
            email: '',
            picture: ''
        });

    return (
        <Container
            maxWidth={false}
            sx={{
                my: 4,
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'right',
                alignItems: 'center',
                bgcolor: '#45464f',
                color: 'white',
                m: 0,
                p: 1,
            }}>
            <UserProfile props={{
                userProfile: userProfile,
                setUserProfile: setUserProfile,
                loginHandler: loginHandler
            }} />
        </Container>
    )
}