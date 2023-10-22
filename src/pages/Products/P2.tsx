import React from 'react';
import { Container, Typography, Grid, Paper, useMediaQuery } from '@mui/material';
import { useData } from '../../context/dataContext';

// const products = [
//   { name: 'Produkt 1', price: '$19.99', imageUrl: '/test2.jpeg' },
//   { name: 'Produkt 2', price: '$29.99', imageUrl: '/test2.jpeg' },
//   { name: 'Produkt 3', price: '$39.99', imageUrl: '/test2.jpeg' },
//   { name: 'Produkt 1', price: '$19.99', imageUrl: '/test2.jpeg' },
//   { name: 'Produkt 2', price: '$29.99', imageUrl: '/test2.jpeg' },
//   { name: 'Produkt 3', price: '$39.99', imageUrl: '/test2.jpeg' },
//   { name: 'Produkt 1', price: '$19.99', imageUrl: '/test2.jpeg' },
//   { name: 'Produkt 2', price: '$29.99', imageUrl: '/test2.jpeg' },
//   { name: 'Produkt 9', price: '$39.99', imageUrl: '/test2.jpeg' },
// ];



function ProductList() {
    const isLargeScreen = useMediaQuery('(min-width: 768px');
    const { products } = useData();
  return (
    <Container 
        maxWidth="sm" 
        sx={{position: 'relative', overflow: 'hidden', minHeight: '300px'}}
        >

      {products.map((product, index) => (
        <Paper key={index} elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <img src={product.imageURL} alt={product.name} style={{ width: '100%', height: 'auto' }} />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {product.price}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Container>
  );
}

export default ProductList;