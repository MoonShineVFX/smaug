import { Container } from "@mui/system";
import React, { useState } from "react";
import LoginContainer from "./LoginContainer";
// import UserProfile from "./UserProfile";
import { loginHandler } from '../libs/client/login';
import { Login } from "@mui/icons-material";

interface headProps {
  props?: any;
  children?: React.ReactNode;
}

export default function Header(props: headProps): JSX.Element {

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'right',
        alignItems: 'center',
        color: 'white'
      }}>
      <LoginContainer />
    </Container>
  )
}