import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Grid, Theme, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Outlet, useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';


const theme: Theme = createTheme({
  typography: {
    fontSize: 30,
  }
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Grid container justifyContent={"center"}>
        <Navbar/>
        <Outlet/>
        <ToastContainer />
      </Grid>
    </ThemeProvider>
  );
}

export default App;