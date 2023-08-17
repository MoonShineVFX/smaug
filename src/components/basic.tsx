import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';

export const OutLineButton = styled(Button)(({ theme }) => ({
    color: "#bbb",
    borderColor: "#bbb",
    '&:hover': {
      backgroundColor: "#fff",
      color: "#000",
    },
  }));