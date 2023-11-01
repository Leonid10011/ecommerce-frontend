import React, { FormEvent, useState } from 'react';
import { css } from '@emotion/react'; // Importiere css aus @emotion/react
import styled from '@emotion/styled'; // Importiere styled aus @emotion/styled
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material//Grid';

import keycloak from '../../keycloak-config';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Divider } from '@mui/material';
import { useAuth } from '../../context/authContext';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { useData } from '../../context/dataContext';
import { useOrder } from '../../context/orderContext';
import { useInit } from '../../context/initContext';

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
  const [ searchTerm, setSearchTerm ] = useState<string>("");

  const { test, doSearch } = useInit();

  const { resetCart } = useOrder();

  const navigation = useNavigate();

  const logout = () => {
    resetCart();
    resetToken();
    navigation("/");
  }

  const handleSearch = (e: FormEvent) => {
    //fetchAndSetProductsByName(searchTerm);
    doSearch(searchTerm);
    navigation("/p");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  return (
      <AppBar  position='sticky' sx={{backgroundColor: '#f1f1f1'}}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Link to="/"><Logo src="/logo.png" alt="Logo" /></Link>
            </Grid>
            <Grid item xs={8} display={'flex'} justifyContent={'flex-end'}>
              <Grid item>
                { token === ""
                ? 
                <IconButton aria-label='Login' onClick={() => navigation("/signin")}><LoginIcon/></IconButton>
                : <IconButton aria-label='Logout' onClick={logout}><LoginIcon/></IconButton>}
                <IconButton aria-label="Warenkorb" onClick={() => navigation("/cart")}><ShoppingCartIcon/></IconButton>
              </Grid>
            </Grid>
              <Grid item xs={12} sx={{display: 'flex', alignContent: 'center'}}>
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
  );
}

export default Navbar;