import React from 'react';
import Typography from '@mui/material/Typography';
import Header from '../components/Header';


export default function Home() {
  return (
    <Header>
        <Typography variant="h1" component="h2" gutterBottom>
            Welcome to Next.js!
        </Typography>
    </Header>
  )
}