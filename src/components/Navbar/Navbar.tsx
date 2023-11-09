import React, { ChangeEvent, FormEvent, FunctionComponent, MouseEventHandler, useEffect, useReducer, useRef, useState } from 'react';
import { css } from '@emotion/react'; // Importiere css aus @emotion/react
import styled from '@emotion/styled'; // Importiere styled aus @emotion/styled
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material//Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FilterListIcon from '@mui/icons-material/FilterList';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Drawer, Input, List, ListItem, ListItemText, Menu, MenuItem, Popper, Slider, Switch, TextField, Typography } from '@mui/material';
import { useAuth } from '../../context/authContext';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { useOrder } from '../../context/orderContext';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import { useProduct } from '../../context/productContext';

const logoStyles = css`
  width: 60px;
  height: 60px;
  margin-right: 2rem; 
`;

const Logo = styled('img')`
  ${logoStyles}
`;



function Navbar() {
  const { resetToken, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const { fetchAndSetProductsByName, filterProducts, manageFilter } = useProduct();

  const { resetCart } = useOrder();

  const navigation = useNavigate();

  const logout = () => {
    resetCart();
    resetToken();
    toast.info("Logged out", {
      position: "bottom-center"
    });
    navigation("/");
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setMobileOpen(open);
  };

  const handleSearch = (e: FormEvent) => {
    fetchAndSetProductsByName(searchTerm);
    navigation("/p");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const links = [
    {
      name: "Home",
      link: "/",
    },{
      name: "Products",
      link: "/p",
    }];


    const notify = () => {
      toast.error("Not implemented yet!", {
        position: 'top-center'
      });
    };

    const [anchorEL, setAnchorEl] = useState<Element | null>(null);

    const handleClose = () => {
      setAnchorEl(null);
    }

    const handleClick = (e: React.FormEvent<HTMLButtonElement>) => {
      //manageFilter({type: 'SET_PRICE_OP', payload: 'greater'}, false);
     // manageFilter({type: 'SET_PRICE_VALUE', payload: 50}, false);
      //manageFilter({type: 'SET_FILTER', payload: false}, true);
      if(e.currentTarget === anchorEL)
        setAnchorEl(null)
      else
        setAnchorEl(e.currentTarget);
    }

    const handleItemClick = (item: string) => {
      console.log("Item Clicked.")
    }

    const menutItems: MenuItemType[] = [
      {
        text: "Nummer 1",
        value: "test 1"
      },
      {
        text: "Nummer 2",
        value: "test 2"
      },
    ] 

  return (
    <Box width={"100%"}>
      <AppBar position="sticky" sx={{ backgroundColor: '#f1f1f1' }}>
        <Toolbar>
          <Grid container alignItems={"center"}>
            <Grid item xs={1}>
              <IconButton
                size="large"
                edge="start"
                color="primary"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs={1}>
              <Link to="/"><Logo src="/logo.png" alt="Logo" /></Link>
              
            </Grid>
            <Grid item xs={5} sx={{backgroundColor: 'yellow'}}>
            </Grid>
              <Grid item xs={5} display={'flex'} justifyContent={'flex-end'}>
      
                <Grid item>
                  { !isAuthenticated
                  ? 
                  <IconButton aria-label='Login' onClick={() => { navigation("/signin")}}><LoginIcon/></IconButton>
                  : (
                  <>
                    <IconButton aria-label='Profile'><AccountCircleIcon/></IconButton>
                    <IconButton aria-label='Logout' onClick={logout}><LogoutIcon/></IconButton>
                  </>
                  )}
                  <IconButton aria-label="Warenkorb" onClick={() => navigation("/cart")}><ShoppingCartIcon/></IconButton>
                </Grid>
              </Grid>
                <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', my: 1}}>
                  <button onClick={handleSearch}>
                    <SearchIcon />
                  </button>
                  <InputBase
                    onChange={handleChange}
                    placeholder="Suche..."
                    inputProps={{ 'aria-label': 'search' }}
                    sx={{
                      border: "1px solid black",
                      borderRadius: "5px",
                      px: 2,
                      mx: 2
                    }}
                  />
                <IconButton onClick={handleClick}>
                  <FilterListIcon/>
                </IconButton>
                <BasicMenu anchor={anchorEL} menuItems={menutItems} handleItem={handleItemClick} handleClose={handleClose} />
                </Grid>
            </Grid>
          </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Box
          sx={{
            width: 240,
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            padding: 2,
          }}
        >
          <Typography variant="h6">Menu</Typography>
          <List>
            {links.map((item) => (
              <ListItem button key={item.name} onClick={() => setMobileOpen(false)}>
                <Link to={item.link}>
                  <ListItemText primary={item.name} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

interface MenuItemType {
  text: string,
  value: string,
}

interface BasicMenuProps<T, F> {
  anchor: Element | null,
  menuItems: T[],
  handleItem: (p: F) => void,
  handleClose: () => void
}

// TODO
const BasicMenu =<T extends { text: string, value: F}, F>({ anchor, menuItems, handleItem, handleClose}: BasicMenuProps<T, F>) => {

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const handleMenuItemClick = (item: T, e: React.MouseEvent<HTMLLIElement>) => {
    if(e.currentTarget === anchorEl){
      setOpenPopup(false);
      setAnchorEl(null)
    }
    else {
      setOpenPopup(true)
      setAnchorEl(e.currentTarget);
    }
    const valueToPass: F = item.value;
    handleItem(valueToPass);
  }

  const OnClose = () => {
    setOpenPopup(false);
    handleClose()
  }

  return(
    <>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={OnClose}
        sx={{zIndex: 1}}
      >
        <h4>Category</h4>
        <input type='checkbox'/>
        <input type='checkbox'/>
        <input type='checkbox'/>
        <input type='checkbox'/>
        <input type='checkbox'/>
        <h4>Price</h4>
        <Box maxWidth={150} display={'flex'}>
          <label htmlFor="">Von</label>
          <input style={{fontSize: '16px', border: '1px solid black', maxWidth: '20%'}}/>
          <label>Bis</label>
          <input style={{fontSize: '16px', border: '1px solid black', maxWidth: '20%'}}/>
        </Box>
      </Menu>
      {openPopup && <BasicPopUp open={openPopup} anchorEl={anchorEl} />}
    </>
  )
}

const BasicPopUp = ({ open, anchorEl }: { open: boolean; anchorEl: Element | null }) => {
  const [currentValue, setCurrentValue] = useState<number>(10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(Number(e.currentTarget.value));
  };

  return (
    <Popper open={open} anchorEl={anchorEl} sx={{ mr: 5, zIndex: 5, p: 5 }}>
      <Box width={100} component={'form'}>
        <TextField
          value={currentValue}
          onChange={handleChange}
          autoFocus
        />
      </Box>
    </Popper>
  );
};

export default Navbar;