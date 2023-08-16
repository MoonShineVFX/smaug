import { Container } from "@mui/system";
import React from "react";
import LoginContainer from "./LoginContainer";

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
        color: 'white',
        marginRight: 0,
      }}>
      <LoginContainer />
    </Container>
  )
}