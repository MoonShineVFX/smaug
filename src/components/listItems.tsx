import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import AssignmentIcon from '@mui/icons-material/Assignment';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import { mainList , memberList } from './listItemData'
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
          <Icon />
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

export const secondaryListItems = (
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
);