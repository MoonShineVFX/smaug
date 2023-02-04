import * as React from 'react';
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
const CustomListWithCollapse = ({listData}:typesListData) =>{
  const [open, setOpen] = React.useState(true);
  const { title,iconname } = listData
  const Icon = components[`Md${iconname}`]
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton  onClick={handleClick}>
        <ListItemIcon>
          <Icon  size="22px"/>
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
      {
        listData.subitems &&
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {
              listData.subitems.map((item,index)=>{
                return(
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary={item.name}/>
                  </ListItemButton>
                )
              })
            }

          </List>
        </Collapse>
      }

    </>
  )
}
const CustomListWithCollapseForTag = ({listData}:typesListData) =>{
  const [open, setOpen] = React.useState(true);
  const { title,iconname } = listData
  const Icon = components[`Md${iconname}`]
  const handleClick = () => {
    setOpen(!open);
  };
  const handleTagClick=()=>{
    console.log('click')
  }

  return (
    <>
      <ListItemButton  onClick={handleClick}>
        <ListItemIcon>
          <Icon  size="22px"/>
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
      {
        listData.subitems &&
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{
              display: 'flex',
              flexWrap:"wrap",
              p: 1,
              m: 1,
          }}>
            {
              listData.subitems.map((item,index)=>{
                return(
                  <Chip label={item.name} onClick={handleTagClick} sx={{m: .5, fontSize:'12px'}}/>
                )
              })
            }

          </Box>
        </Collapse>
      }

    </>
  )
}

export const MainListItems =()=> {

  return (
    <React.Fragment>
      {
        mainList.map((item,index)=>{
          return(
            <CustomListWithCollapse listData={item} />
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
            <CustomListWithCollapseForTag listData={item} />
          )
        })
      }

    </React.Fragment>
  );
} 

export const MemberListItems = () =>{
  return(
    <React.Fragment>
    <ListSubheader component="div" inset>
      會員功能（如有登入)
    </ListSubheader>
    {
       memberList.map((item,index)=>{
        return(
          <ListItemButton>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        )
       })
    }
  </React.Fragment>
  )
}