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
import ViewInArIcon from '@mui/icons-material/ViewInAr';
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
          <div style={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="280"
              image={model?.preview === "" ?  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/No_image_available_500_x_500.svg/1200px-No_image_available_500_x_500.svg.png' : model?.preview} 
              alt={model?.name}
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
              <IconButton aria-label="close" onClick={()=>setShowDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            

          </div>
         
          <CardContent sx={{backgroundColor:'#333' , px:3}}>
            <Typography gutterBottom variant="h5" component="div" sx={{fontWeight:'bolder' ,textTransform:'uppercase',mb:0}}>
              {model?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{textTransform:'uppercase' }}>
              {model?.categoryName}
            </Typography>
          </CardContent>

        </Card>


        <Box sx={{p:3}}>
          <Typography variant="h6" color="text.secondary" >
            Resource
          </Typography>
           
          
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