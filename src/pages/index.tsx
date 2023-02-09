import * as React from 'react';
import { modalItemData,modalItemData2 } from '../components/listItemData'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import Image from 'next/image'
import img1 from '../public/images/p1.jpg'
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
export default function Home() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
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
          px: [1],
        }}
      >
      </Toolbar>
        <img src="https://ddinktqu5prvc.cloudfront.net/rmyxk/Grid_render_thumb_thumb.jpg" alt="" />
        <Box sx={{ p:2}}>
          <Typography variant="h4" gutterBottom>
            Vegetables
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            3D Assets
          </Typography>
        </Box>

        <Box sx={{p:2}}>
          data info 
        </Box>
        <Box sx={{display:'flex',position:'absolute',bottom:0,width:'100%',justifyContent:'center', p:2, bgcolor:"#202020"}}>
          <Button variant="contained" sx={{m:1, width: .5}}>Download</Button>
        </Box>
        
      </Drawer>
      <ImageList sx={{}}  cols={5} gap={8}  sx={{mx:2 , my:2}} variant="standad" >
        <ImageListItem key="Subheader" cols={5}>
          <ListSubheader component="div">3D Assets</ListSubheader>
        </ImageListItem>
        {modalItemData2.map((item) => {
          return(
            <ImageListItem key={item.img} 
              sx={{
                bgcolor:'#202020', p:5,borderRadius: "5px",border:"2px #202020 solid", transition:'all 0.3s',
                ':hover':{
                  border:"2px grey solid"
                } 
              }}
              onClick={toggleDrawer}
            
            >

            <img
              src={item.img}
              alt={item.title}
              loading="lazy"
              style={{borderRadius: "5px" , objectFit:'contain', aspectRatio:1/1  }}
              
            />
            <ImageListItemBar
              title={item.title}
            />

            </ImageListItem>
          )
        }
          
      )}
      </ImageList>
    </>


  )
}