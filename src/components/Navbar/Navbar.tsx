import React, { FormEvent, useState } from 'react';
import { css } from '@emotion/react'; // Importiere css aus @emotion/react
import styled from '@emotion/styled'; // Importiere styled aus @emotion/styled
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material//Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useAuth } from '../../context/authContext';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { useOrder } from '../../context/orderContext';
import { useInit } from '../../context/initContext';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

const logoStyles = css`
  width: 100%;
  height: 50px;
  margin-right: 2rem; // Wir verwenden hier direkt eine Zahl für den Abstand, um es einfach zu halten
`;

const Logo = styled('img')`
  ${logoStyles}
`;



function Navbar() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const { token, resetToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const { doSearch } = useInit();

  const { resetCart } = useOrder();

  const navigation = useNavigate();

  const logout = () => {
    resetCart();
    resetToken();
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
    //fetchAndSetProductsByName(searchTerm);
    doSearch(searchTerm);
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
                  { token === ""
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
                <Grid item xs={12} sx={{display: 'flex', alignContent: 'center', my: 1}}>
                  <button onClick={handleSearch}>
                    <SearchIcon />
                  </button>
                  <InputBase
                    onChange={handleChange}
                    placeholder="Suche..."
                    inputProps={{ 'aria-label': 'search' }}
                  />
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

export default Navbar;