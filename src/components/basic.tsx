import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

export const OutLineButton = styled(Button)(({ theme }) => ({
  color: "#bbb",
  borderColor: "#bbb",
  '&:hover': {
    backgroundColor: "#fff",
    color: "#000",
  },
}));


export const CircularIndeterminate = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}


export const EmptyState = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
      <Typography>No Asset In This Category</Typography>
    </Box>
  )
}

export const ErrorState = (err: any) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Typography>{`${err.message}`}</Typography>
    </Box>
  )
}