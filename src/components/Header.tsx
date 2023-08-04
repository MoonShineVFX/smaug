import { Container } from "@mui/system";
import React, { useState } from "react";
import { UserInfo } from "../libs/types";
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
            sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'right',
                alignItems: 'center',
                color: 'white'
            }}>
            <UserProfile props={{
                userProfile: userProfile,
                setUserProfile: setUserProfile,
                loginHandler: loginHandler
            }} />
        </Container>
    )
}