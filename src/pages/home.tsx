import React,{ useState, useEffect } from 'react';
import {modalItemData2 } from '../components/listItemData'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import Image from 'next/image'
import img1 from '../public/images/p1.jpg'
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
import {  useRecoilValue ,useRecoilState } from 'recoil';
import { modelDrawerDisplayState, modelState } from '../atoms/fromTypes';

import { fetchData } from '../libs/client/fetchFunction';
import { useRouter } from "next/router";
interface IassetsListItem{
  id:string;
  name:string;
  preview:string;
  categoryName:string;
  createAt:string;
  updateAt:string;
}
export default function Home() {
  const [currentModel, setCurrentModel] = useRecoilState(modelState);
  const [showDrawer, setShowDrawer] = useRecoilState(modelDrawerDisplayState);
  const model = useRecoilValue(modelState);
  const [assetsListItem, setAssetsListItem] = useState<IassetsListItem[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const toggleDrawer = () => {
    setOpen(!open);
  };
  useEffect(()=>{
    if(!router.isReady) return;
    async function getAssets() {
      const assets = await fetchData(`/api/assets?cid=${router.query.categoryId}`);
      console.log(assets)
      setAssetsListItem(assets);
    }
    getAssets()
  },[router])
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
          <CardActions>
            <IconButton aria-label="close" onClick={()=>setShowDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </CardActions>
            <CardMedia
              component="img"
              height="280"
              image={model?.thumbnails}
              alt={model?.thumbnails}
              sx={{objectFit:"contain", bgcolor:"#202020" , p:2}}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {model?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {model?.category}
              </Typography>
            </CardContent>

        </Card>


        <Box sx={{p:2}}>
          data info 
        </Box>
        <Box sx={{display:'flex',position:'absolute',bottom:0,width:'100%',justifyContent:'center', p:2}}>
          <Button variant="contained" sx={{m:1, width: .5}}>Download</Button>
        </Box>
        
      </Drawer>
      <ImageList sx={{}}  cols={5} gap={8}  sx={{mx:2 , my:2}} variant="standad" >
        <ImageListItem key="Subheader" cols={5}>
          <Typography variant="h5" sx={{fontWeight:'bold', color:"#999"}}>
            {assetsListItem[0]?.categoryName}
          </Typography>;
        </ImageListItem>
        {assetsListItem.map((item,index) => {
          return(
            <ImageListItem key={item.id} 
              sx={{
                bgcolor:'#202020', p:5,borderRadius: "5px",border:"2px #202020 solid", transition:'all 0.3s',
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
                }
              }
            >
              <img
                src={item.preview === "" ?  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/No_image_available_500_x_500.svg/1200px-No_image_available_500_x_500.svg.png' : "2"} 
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