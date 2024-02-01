import { MdViewModule, MdLabel, } from 'react-icons/md';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useRouter } from "next/router";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useState } from 'react';

import { trpc } from '../utils/trpc';


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
interface ICollapseTree {
  child?: IChild[],
  open?: boolean;
  isVisible?: boolean | undefined;
}
interface IChild {
  id: number;
  name: string;
  children?: IChild[];
}
const CollapseTree = ({ child, open, isVisible }: ICollapseTree) => {
  const router = useRouter();
  const [subOpen, setSubOpen] = useState(0);
  const handleClick = (id: number) => {
    router.push({ pathname: '/home', query: { categoryId: id } }, undefined, { shallow: true });
    if (subOpen === id) {
      setSubOpen(id)
    } else
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
                    pl: 2, py: 0,
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
                {subOpen === child.id ? <CollapseTree child={child.children} open={true} isVisible={Boolean(subOpen)} /> : <></>}
              </Box>
            )
          })
        }
      </List>
    </Collapse>

  )
}


interface ImainMenuData {
  id: string;
  name: string;
}

const CustomListWithCollapse = ({ mainMenuData }: { mainMenuData: ImainMenuData }) => {
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const menuTreeQry = trpc.menus.categories.useQuery({ menuId: mainMenuData.id });

  if (menuTreeQry.isLoading) return (
    <Box sx={{ justifyContent: "center", justifyItems: "center" }}>
      <Typography>
        Loading...
      </Typography>
    </Box>
  )
  if (menuTreeQry.isError) return (
    <Box>
      {menuTreeQry.error.message}</Box>)
  return (
    <>
      {
        menuTreeQry.isSuccess &&
        <CustomerNav >
          <ListItemButton onClick={handleClick}>
            <ListItemIcon >
              <Icon>{menuTreeQry.data.menuTree.iconName}</Icon>
            </ListItemIcon>

            <ListItemText primary={menuTreeQry.data.menuTree.name} />
          </ListItemButton>
          <CollapseTree child={menuTreeQry.data.menuTree.children} open={open} isVisible={false} />
        </CustomerNav>
      }
    </>
  )
}


interface IMainListItems {
  mainMenuData?: ImainMenuData
}

export const MainListItems = ({ mainMenuData }: IMainListItems) => {
  return (
    mainMenuData ?
      <CustomListWithCollapse mainMenuData={mainMenuData} /> :
      <></>
  );
}
