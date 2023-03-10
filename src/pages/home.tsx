import React,{ useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { experimentalStyled as styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {  useRecoilValue ,useRecoilState } from 'recoil';
import { modelDrawerDisplayState, modelState } from '../atoms/fromTypes';

import { useRouter } from "next/router";
import useSWR from "swr";
import ModelDrawer from '../components/ModelDrawer';
interface IassetsListItem{
  id:string;
  name:string;
  preview:string;
  categoryName:string;
  createAt:string;
  updateAt:string;
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
export default function Home() {
  const [showDrawer, setShowDrawer] = useRecoilState(modelDrawerDisplayState);
  const router = useRouter();
  const handleClick = (id:string) => {
    router.push({pathname: '/home' , query: {categoryId:id} }, undefined, { shallow: true });
  }
  const { categoryId,assetId } = router.query;
  const { data: assetsListItem } = useSWR(categoryId ? [`/api/assets?cid=${categoryId}` ] : null, fetcher);
  const { data: assetItem } = useSWR(assetId ? [`/api/assets/${assetId}` ] : null, fetcher);

  // 暫時註解 若有需要再開
  // if(menuTreeId) {
  //   if(!mainOptionsListItem) return <div>Loading</div>
  //   console.log(mainOptionsListItem)
  //   return(
  //     <Box sx={{ flexGrow: 1 , p:5 }} >
  //       <Box>
  //         <Typography variant="h5" sx={{fontWeight:'bold', color:"#999"}}>
  //           Categories
  //         </Typography>
  //       </Box>
  //       <Grid container sx={{pt:5,px:1}} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
  //         {mainOptionsListItem.children.map((item,index) => {
  //           return(
  //               <Grid xs={2} sm={4} md={4} key={index}
  //                 sx={{
  //                    transition:'all 0.3s',
  //                    p:1.5
  //                 }}
  //                 onClick={() => handleClick(item.id)}
  //               >
  //                 <Item>{item.name}</Item>
  //               </Grid>
  //             )
  //           }
  //         )}
  //       </Grid>

  //     </Box>
  //   )
  // }

  //Loading
  if (!assetsListItem) return (
    <Grid container wrap="nowrap" sx={{mx:2 , my:2}}>
      <Box sx={{ width: '20%', marginRight: 1, my: 5 }}>
        <Skeleton variant="rounded" width='100%'  height={220} />
      </Box>
      <Box sx={{ width: '20%', marginRight: 1, my: 5 }}>
        <Skeleton variant="rounded" width='100%' height={220} />
      </Box>
    </Grid>

  );
  return (
    <> 
      {
        assetId && <ModelDrawer open={showDrawer} assetItem={assetItem}/> 
      }
      
      <ImageList sx={{}}  cols={5} gap={8}  sx={{mx:2 , my:2}} variant="standad" >
        <ImageListItem key="Subheader" cols={5}>
          <Typography variant="h5" sx={{fontWeight:'bolder', color:"#999", textTransform:"uppercase"}}>
            {assetsListItem[0]?.categoryName}
          </Typography>;
        </ImageListItem>
        {assetsListItem.map((item,index) => {
          return(
            <ImageListItem key={item.id} 
                sx={{
                  bgcolor:'#202020', p:5,borderRadius: "5px",border:"2px #202020 solid", transition:'all 0.3s',cursor:'pointer',
                  ':hover':{
                    border:"2px grey solid"
                  },
                  ':hover .MuiImageListItemBar-root':{
                    display:"block"
                  }  
                }}
                onClick={()=>{
                  router.query.assetId = item.id
                  router.push(router)
                  setTimeout(()=>{
                    setShowDrawer(true);
                  },500)

                }
              }
            >
              <img
                src={item.preview === "" ?  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/No_image_available_500_x_500.svg/1200px-No_image_available_500_x_500.svg.png' : item.preview} 
                alt={item.name}
                loading="lazy"
                style={{borderRadius: "5px" , objectFit:'contain', aspectRatio:1/1  }}
                
              />
              <ImageListItemBar
                title={item.name}
                position="bottom"
                sx={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 20%, rgba(0,0,0,0) 50%)',
                  display:'none'
                }}
              />

            </ImageListItem>
          )
        }
          
      )}
      </ImageList>
    </>


  )
}