import React,{ useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import {  useRecoilValue ,useRecoilState } from 'recoil';
import { modelDrawerDisplayState, modelState } from '../atoms/fromTypes';

import { fetchData } from '../libs/client/fetchFunction';
interface IhomeListItem{
  id:string;
  name:string;
  iconName:string;
  children: any[];
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#202020' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition:'0.6s',
  cursor:"pointer",
  fontSize:"16px",
  '&:hover':{
    backgroundColor: '#333',
  },
}));
export default function Index() {
  const [currentModel, setCurrentModel] = useRecoilState(modelState);
  const [showDrawer, setShowDrawer] = useRecoilState(modelDrawerDisplayState);
  const model = useRecoilValue(modelState);
  const [homeListItem, setHomeListItem] = useState<IhomeListItem>({
    id:"",
    name:"",
    iconName:"",
    children: []
  });
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  useEffect(()=>{
    async function getAssets() {
      const homeList = await fetchData('/api/menuTree?id=cler1rzxz0008k1q57xghe0b9');
      console.log(homeList)
      setHomeListItem(homeList);
    }
    getAssets()
  },[])
  return (
    <>
      <Box sx={{ flexGrow: 1 , p:5 }} >
        <Box>
          <Typography variant="h5" sx={{fontWeight:'bold', color:"#999"}}>
            Categories
          </Typography>
        </Box>

        <Grid container sx={{pt:5}} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {homeListItem.children.map((item,index) => {
            return(
                <Grid xs={2} sm={4} md={4} key={index}
                  sx={{
                     transition:'all 0.3s',
                  }}
                  onClick={()=>{
                      setShowDrawer(true);
                      setCurrentModel(item);
                    }
                  }
                >
                  <Item>{item.name}</Item>
                </Grid>
              )
            }
          )}
        </Grid>
        
      </Box>
    </>


  )
}