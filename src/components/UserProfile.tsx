import Raect, { useState } from 'react';
import { Button, Popover, Typography } from '@mui/material';

function UserProfile() {
    const [userInfo, setUserInfo] = useState({});
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);

    };
    
    return (<div>
        <Button aria-describedby={userInfo.id} variant="contained" onClick={handleClick}>
            Open Popover
        </Button>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
        </Popover>
    </div>)

    export default UserProfile;
