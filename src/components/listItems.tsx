import * as React from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import Box, { BoxProps } from '@mui/material/Box';
import { mainList , memberList ,tagList } from './listItemData'
import {MdViewModule,MdLabel , } from 'react-icons/md';
interface typesListData {
  listData:{
    title: string;
    iconname?: string;
    subitems?:[{}]
  }

}
const components = {
  MdViewModule,
  MdLabel,
}
const CustomerNav = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
  '& .MuiCollapse-root':{
    marginLeft:16,
  }
});

const CollapseTree = ({child,open,isVisible})=>{
  console.log(child)
  const [subOpen, setSubOpen] = React.useState('');
  const handleClick = (id)=>{
    console.log('click')
    setSubOpen(id)
  }
  
  return(

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ my:0}}>
          {
            child?.map((child,index)=>{
              return(
                <Box component="div" key={child.id} >
                  <ListItemButton 
                    sx={{
                      pl:2,py:.3 , color:'grey',
                      ':hover':{
                        color:'white'
                      },
                      ...(subOpen ===  child.id ? {
                        color:'white'
                      } : {color:'grey'})
                    }} 
                    onClick={()=>handleClick(child.id)}
                  >
                    <ListItemText primary={child.name}/>
                  </ListItemButton>
                  {subOpen ===  child.id ?  <CollapseTree child={child.children} open={true} isVisible={subOpen}/> : <></>}
                </Box>
 
              )
            })
          }

        </List>
      </Collapse>
   
  )
}
const CustomListWithCollapse = ({listData}:typesListData) =>{
  const [open, setOpen] = React.useState(true);
  const { name,iconname } = listData
  const Icon = components[`Md${iconname}`]
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <CustomerNav>
      <ListItemButton  onClick={handleClick}>
        <ListItemIcon >
          <Icon  size="22px"/>
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>

      <CollapseTree child={listData.children} open={open}/>
    </CustomerNav>
  )
}
const CustomListWithCollapseForTag = ({listData}:typesListData) =>{
  const [open, setOpen] = React.useState(true);
  const { name,iconname } = listData
  const Icon = components[`Md${iconname}`]
  const handleClick = () => {
    setOpen(!open);
  };
  const handleTagClick=()=>{
    console.log('click')
  }

  return (
    <CustomerNav>
      <ListItemButton  onClick={handleClick}>
        <ListItemIcon>
          <Icon  size="22px"/>
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
      {
        listData.children &&
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{
              display: 'flex',
              flexWrap:"wrap",
              p: 1,
              m: 1,
          }}>
            {
              listData.children.map((item,index)=>{
                return(
                  <Chip key={item.name} label={item.name} onClick={handleTagClick} sx={{m: .5, fontSize:'12px'}}/>
                )
              })
            }

          </Box>
        </Collapse>
      }

    </CustomerNav>
  )
}

export const MainListItems =()=> {

  return (
    <React.Fragment>
      {
        mainList.map((item,index)=>{
          return(
            <CustomListWithCollapse listData={item} key={index} />
          )
        })
      }

    </React.Fragment>
  );
} 
export const TagListItems =()=> {

  return (
    <React.Fragment>
      {
        tagList.map((item,index)=>{
          return(
            <CustomListWithCollapseForTag listData={item} key={index} />
          )
        })
      }

    </React.Fragment>
  );
} 

export const MemberListItems = () =>{
  return(
    <CustomerNav>
    <ListSubheader component="div" inset>
      會員功能（如有登入)
    </ListSubheader>
    {
       memberList.map((item,index)=>{
        return(
          <ListItemButton key={index}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        )
       })
    }
  </CustomerNav>
  )
}