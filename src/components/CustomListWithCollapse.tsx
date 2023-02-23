//TEST Component No USE

import React,{ useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import Box, { BoxProps } from '@mui/material/Box';
import * as FontAwesome from "react-icons/fa";
import { useRouter } from "next/router";
import { fetchData } from '../libs/client/fetchFunction';
interface typesMainMenuData {
  id: string;
  name: string;
}
function CustomListWithCollapse({ mainMenuData }: typesMainMenuData) {
  const [open, setOpen] = useState(true);
  const [listItem, setListItem] = useState({});
  const { id,name } = mainMenuData
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
    '& .MuiCollapse-root': {
      marginLeft: 16,
    }
  });
  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(()=>{
    async function getItems() {
      const items = await fetchData('/api/menuTree?id='+id );
      console.log(items)
      setListItem(items);
    }
    getItems()
  },[])

  return (
    <>
     {
      Object.keys(listItem).length > 0 && 
      listItem.message === 'Menu Categories not found' ? 
      <></>
      :
      <CustomerNav >
        <ListItemButton onClick={handleClick}>
          <ListItemIcon >
            {/* <Icon size="22px" /> */}
            {/* <>{React.createElement(FontAwesome[listItem.iconName])}</> */}
            
            {/* <Icon iconName={listItem.iconName} size={20}  /> */}
          </ListItemIcon>
          <ListItemText primary={listItem.name} />
        </ListItemButton>
        <CollapseTree child={listItem.children} open={open} isVisible={false} /> 
       </CustomerNav>
     }
    </>
  )
}
const CollapseTree = ({child,open,isVisible}:ICollapseTree)=>{
  console.log(child)
  const router = useRouter();
  const [subOpen, setSubOpen] = React.useState('');
  const handleClick = (id) => {
    if(subOpen === id){
      setSubOpen('')
      return
    }
    console.log('click')
    //需要做成多層路徑分類＋分類＋分類
    router.push({pathname: '/' , query: {categoryId:id} }, undefined, { shallow: true });
    setSubOpen(id)
  }
  return (

    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding sx={{ my: 0 }}>
        {
          child?.map((child, index) => {
            return (
              <Box component="div" key={child.id} >
                <ListItemButton
                  sx={{
                    pl: 2, py: .3,
                    ':hover': {
                      color: 'white'
                    },
                    ...(subOpen === child.id ? {
                      color: 'white'
                    } : { color: 'grey' })
                  }}
                  onClick={() => handleClick(child.id)}
                >
                  <ListItemText primary={child.name} />
                </ListItemButton>
                {subOpen === child.id ? <CollapseTree child={child.children} open={true} isVisible={subOpen} /> : <></>}
              </Box>

            )
          })
        }

      </List>
    </Collapse>

  )
}

export default CustomListWithCollapse