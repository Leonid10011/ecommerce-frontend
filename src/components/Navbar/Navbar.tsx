import React from 'react';
import { css } from '@emotion/react'; // Importiere css aus @emotion/react
import styled from '@emotion/styled'; // Importiere styled aus @emotion/styled
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material//Grid';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Divider } from '@mui/material';
import { useAuth } from '../../context/authContext';
import { Link, useNavigate, useNavigation } from 'react-router-dom';

const appBarStyles = css`
  z-index: 100;
  background-color: #fff;
`;

const logoStyles = css`
  margin-right: 2rem; // Wir verwenden hier direkt eine Zahl für den Abstand, um es einfach zu halten
`;

const searchStyles = css`
  flex: 1;
  margin: 0 1rem; // Wir verwenden hier direkt eine Zahl für den Abstand, um es einfach zu halten
`;

const loginCartContainerStyles = css`
  display: flex;
  align-items: center;
`;

const NavbarContainer = styled(AppBar)`
  ${appBarStyles}
`;

const Logo = styled('img')`
  ${logoStyles}
`;

const SearchContainer = styled(Grid)`
  ${searchStyles}
`;

const LoginCartContainer = styled(Grid)`
  ${loginCartContainerStyles}
`;

function Navbar() {

  const { token, resetToken } = useAuth();

  const navigation = useNavigate();

  const logout = () => {
    resetToken();
    navigation("/")
  }

  return (
      <NavbarContainer  position='sticky'>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item>
              <Logo src="/logo.png" alt="Logo" />
            </Grid>
              <SearchContainer item>
                <SearchIcon />
                <InputBase
                  placeholder="Suche.sda.."
                  inputProps={{ 'aria-label': 'search' }}
                />
              </SearchContainer>
          <LoginCartContainer item>
              { token === ""
              ? 
              <IconButton aria-label='Login' onClick={() => navigation("/signin")}><LoginIcon/></IconButton>

              : <IconButton aria-label='Logout' onClick={logout}><LoginIcon/></IconButton>}
              <IconButton aria-label="Warenkorb"><ShoppingCartIcon/></IconButton>
          </LoginCartContainer>
          </Grid>
        </Toolbar>
      </NavbarContainer>
  );
}

export default Navbar;