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
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#45464f',
                color: 'white',
                margin: 0,
            }}>
            <UserProfile />
        </Container>
    )
}