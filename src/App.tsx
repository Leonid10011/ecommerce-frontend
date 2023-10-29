import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Grid, Theme, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Header from './components/Header/Header';
import { Outlet, useLocation, useNavigate } from 'react-router';
import Products from './pages/Products/Products';
import keycloak from './keycloak-config';


const theme: Theme = createTheme({
  typography: {
    fontSize: 30,
  }
});

function App() {
  
  
  const [title,setTitle] = useState<string>("");

  const location = useLocation();

  const navigation = useNavigate();

  useEffect(() => {
    const parsedTitle = location.pathname.replace(/\W/g, ' ');
    setTitle(parsedTitle);
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Navbar/>
        <Outlet/>
      </Grid>
    </ThemeProvider>
  );
}

export default App;