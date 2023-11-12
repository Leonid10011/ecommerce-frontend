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
import { Link, useAsyncError, useNavigate, useNavigation } from 'react-router-dom';
import { useOrder } from '../../context/orderContext';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import useProductFilter from '../../hooks/useProductFilter';
import { useProducts } from '../../context/ProductContext';

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

  const { fetchProductsByName } = useProducts();
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

  const { filterConditions } = useProducts();

  const handleSearch = (e: FormEvent) => {
    fetchProductsByName(searchTerm);

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
            <Grid item xs={2}>
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
            <Grid item xs={2}>
              <Link to="/"><Logo src="/logo.png" alt="Logo" /></Link>      
            </Grid>
              <Grid item xs={8} display={'flex'} justifyContent={'flex-end'}>
      
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
                <BasicMenu anchor={anchorEL} menuItems={menutItems} handleItem={handleItemClick} handleClose={handleClose} checks={filterConditions.category}/>
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
  handleClose: () => void,
  checks: number[]
}

// TODO
const BasicMenu =<T extends { text: string, value: F}, F>({ anchor, menuItems, handleItem, handleClose, checks}: BasicMenuProps<T, F>) => {

  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const OnClose = () => {
    setOpenPopup(false);
    handleClose()
  }

  const [currentChecks, setCurrentChecks] = useState<number[]>(checks);

  const navigation = useNavigate();

  const categoriesRef = useRef<HTMLDivElement>(null);

  const { manageFilter } = useProducts();

  interface PriceType {
    min: number,
    max: number
  }

  enum categories {
    shirt = 1,
    hoodie = 2,
    shoes  =3
  }

  const handlePriceChange = (e: FormEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    if(element.name === 'min'){
      manageFilter({type: "SET_PRICE_MINVALUE", payload: Number(element.value)})
    } else if(element.name === 'max'){
      manageFilter({type: "SET_PRICE_MAXVALUE", payload: Number(element.value)})
    } else {
      console.log("Unknown error.");
    }
  }

  const handleCategroyChange = (e: FormEvent<HTMLInputElement>) => {
    const category: string = e.currentTarget.name;
    const checked = e.currentTarget.checked;
    let newChecks;
    
    if (checked) {
      // Füge die Kategorie hinzu, wenn sie noch nicht in 'checks' ist
      newChecks = [...currentChecks, categories[category as keyof typeof categories]];
    } else {
      // Entferne die Kategorie aus 'checks'
      newChecks = currentChecks.filter(check => check !== categories[category as keyof typeof categories]);
    }
    setCurrentChecks(newChecks);
    
    console.log(currentChecks)
    // when check is true, add the category to filter, otherwise remove it
    checked 
    ? manageFilter({type: 'SET_CATEGORY', payload: categories[category as keyof typeof categories]})
    : manageFilter({type: 'REMOVE_CATEGORY', payload: categories[category as keyof typeof categories]})
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
        <div ref={categoriesRef}>
          <div>
            <label htmlFor="shirt">Shirt </label><input type='checkbox' checked={currentChecks.includes(categories.shirt)} name='shirt' onChange={handleCategroyChange}/>
          </div>
          <div>
            <label htmlFor="hoodie">Hoodie </label><input type='checkbox' checked={currentChecks.includes(categories.hoodie)} name='hoodie'onChange={handleCategroyChange}/>
          </div>
          <div>
            <label htmlFor="shoes">Shoes </label><input type='checkbox' checked={currentChecks.includes(categories.shoes)} name='shoes'onChange={handleCategroyChange}/>
          </div>
        </div>
        <h4>Price</h4>
        <Box maxWidth={150} display={'flex'}>
          <label htmlFor="">Von</label>
          <input name={'min'} style={{fontSize: '16px', border: '1px solid black', maxWidth: '20%'}} onChange={handlePriceChange}/>
          <label>Bis</label>
          <input name={'max'} style={{fontSize: '16px', border: '1px solid black', maxWidth: '20%'}} onChange={handlePriceChange}/>
        </Box>
      </Menu>
    </>
  )
}

export default Navbar;