import React,{ useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import {  useRecoilValue ,useRecoilState } from 'recoil';
import { modelDrawerDisplayState, modelState } from '../atoms/fromTypes';
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchData } from '../libs/client/fetchFunction';
interface IhomeListItem{
  id:string;
  name:string;
  iconName:string;
  children: any[];
}
const fetcher = (url) => fetch(url).then((r) => r.json());
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#202020' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition:'0.6s',
  cursor:"pointer",
  fontSize:"16px",
  border:'2px #202020 solid',
  '&:hover':{
    border:"2px grey solid",
    color:'white'
  },
}));
export default function Index() {
  const [currentModel, setCurrentModel] = useRecoilState(modelState);
  const model = useRecoilValue(modelState);
  const router = useRouter();
  const handleClick = (id:string) => {

    router.push({pathname: '/home' , query: {categoryId:id} }, undefined, { shallow: true });
  }
  const { data: menuListItem } = useSWR('/api/menus', fetcher);
  const { data: mainOptionsListItem } = useSWR(`/api/menuTree?id=${menuListItem[0].id}`, fetcher);
  if (!mainOptionsListItem) return <div>Loading</div>
  return (
    <>
      <Box sx={{ flexGrow: 1 , p:5 }} >
        <Box>
          <Typography variant="h5" sx={{fontWeight:'bold', color:"#999"}}>
            Categories
          </Typography>
        </Box>

        <Grid container sx={{pt:5}} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {mainOptionsListItem.children.map((item,index) => {
            return(
                <Grid xs={2} sm={4} md={4} key={index}
                  sx={{
                     transition:'all 0.3s',
                  }}
                  onClick={() => handleClick(item.id)}
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