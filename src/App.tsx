import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Grid, Theme, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Header from './components/Header/Header';
import { Outlet, useLocation } from 'react-router';
import Products from './pages/Products/Products';

const theme: Theme = createTheme({
  typography: {
    fontSize: 30,
  }
});

function App() {
  const [title,setTitle] = useState<string>("");

  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname)
    const parsedTitle = location.pathname.replace(/\W/g, ' ');
    setTitle(parsedTitle);
  }, [location])

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Navbar/>
        <Header title={title}/>
        <Outlet/>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
