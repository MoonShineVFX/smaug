import React,{ useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CloseIcon from '@mui/icons-material/Close';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { experimentalStyled as styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {  useRecoilValue ,useRecoilState } from 'recoil';
import { modelDrawerDisplayState, modelState } from '../atoms/fromTypes';

import { useRouter } from "next/router";
import useSWR from "swr";
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
  const [currentModel, setCurrentModel] = useRecoilState(modelState);
  const [showDrawer, setShowDrawer] = useRecoilState(modelDrawerDisplayState);
  const model = useRecoilValue(modelState);
  const router = useRouter();
  const handleClick = (id:string) => {

    router.push({pathname: '/home' , query: {categoryId:id} }, undefined, { shallow: true });
  }
  const { categoryId,assetId } = router.query;
  
  // const { data: mainOptionsListItem } = useSWR(menuTreeId ? [`/api/menuTree?id=${menuTreeId}` ] : null, fetcher);
  const { data: assetsListItem } = useSWR(categoryId ? [`/api/assets?cid=${categoryId}` ] : null, fetcher);
  const { data: assetItem } = useSWR(assetId ? [`/api/assets/${assetId}` ] : null, fetcher);
  if(assetId){
    if(!assetItem) <div>Loading</div>
    console.log(assetItem)
  }
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
      <Drawer
        anchor="right"
        open={showDrawer}
        variant="persistent"
        PaperProps={{
          sx:{ width:'25%'}
        }}
      > 
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1]
        }}
      >
      </Toolbar>
        
        <Card sx={{  }}>
          <div style={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="280"
              image={assetItem?.preview === "" ?  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/No_image_available_500_x_500.svg/1200px-No_image_available_500_x_500.svg.png' : model?.preview} 
              alt={assetItem?.name}
              sx={{objectFit:"contain", bgcolor:"#202020" , p:2}}
            />
            <Box sx={{ position:'absolute',width:'100%' , px:2 , top:'10px' , display:'flex' ,justifyContent:"space-between"  }}>
              <ButtonGroup 
                variant="contained"  
                color="primary" 
                size="small"
              >
                <Button ><ImageOutlinedIcon fontSize="small"  /></Button>
                <Button ><ViewInArOutlinedIcon fontSize="small"  /></Button>
              </ButtonGroup>
              <IconButton aria-label="close" onClick={()=>{
                setShowDrawer(false)
                router.query.assetId = [];
                router.push(router)
              }}>
                <CloseIcon />
              </IconButton>
            </Box>

            

          </div>
         
          <CardContent sx={{backgroundColor:'#333' , px:3}}>
            <Typography gutterBottom variant="h5" component="div" sx={{fontWeight:'bolder' ,textTransform:'uppercase',mb:0}}>
              {assetItem?.name}
              
              
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{textTransform:'',letterSpacing:'',fontSize:13 }}>
              {assetItem?.categoryList?.replace(/\\/g, " > ").slice(0,-2)}
            </Typography>
            
          </CardContent>

        </Card>


        <Box sx={{p:3}}>
          <Typography variant="body2" color="text.secondary" sx={{fontSize:12,textAlign:'right' }}>
            {assetItem?.createAt?.toLocaleString().substr(0,10)} by {assetItem?.creator}  
          </Typography>
          <Box sx={{pt:3}}>
            <Typography variant="h6" color="text.secondary" sx={{fontSize:18}}>
              Tags
            </Typography>
            <Box sx={{
              display: 'flex',
              flexWrap: "wrap",
              p: 0,
              mt: 1,
            }}>
              {
                assetItem?.tags?.map((item, index) => {
                  return (
                    <Chip 
                      key={item.name} label={item.name} 
                      onClick={()=> { 
                        //handleTagClick(item.id)
                      }} 
                      sx={{ m: .5, fontSize: 13 }} />
                  )
                })
              }

            </Box>
          </Box>
          <Box sx={{pt:3}}>
            <Typography variant="h6" color="text.secondary" sx={{fontSize:18}}>
              Resource
            </Typography>
          </Box>


           
          
        </Box>

        
      </Drawer>
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
                  setShowDrawer(true);
                  setCurrentModel(item);
                  
                  router.query.assetId = item.id
                  router.push(router)
                  console.log(router)

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