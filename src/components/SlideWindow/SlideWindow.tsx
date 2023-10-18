import React, { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import BasicCard from '../common/BasicCard/BasicCard';
import { Grid } from '@mui/material';
import { slideStyles } from './styles';

function SlidingComponent({children} : {
  children: React.ReactNode
}) {
  
  return (
    <Grid item lg={6} sx={slideStyles}>
      {children}
    </Grid>
  );
}

export default SlidingComponent;
