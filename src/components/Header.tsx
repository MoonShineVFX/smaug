import { Container } from "@mui/system";
import React from "react";
import UserProfile from "./UserProfile";

export default function Header() {
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
                p:1,
            }}>
            <UserProfile />
        </Container>
    )
}