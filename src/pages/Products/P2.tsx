import React from 'react';
import { Container, Typography, Grid, Paper, useMediaQuery, Card, CardContent, Button } from '@mui/material';
import { useData } from '../../context/dataContext';

function ProductList() {
    const isLargeScreen = useMediaQuery('(min-width: 768px');
    const { products } = useData();
  
    return (
      <Container maxWidth="sm" sx={{ position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
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
                <Button variant="contained" color="primary">
                  Buy
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Container>
    );
        }

const ProductCard = ({ name, description, price }: {
    name: string,
    description: string,
    price: number
}) => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Typography variant="h6" color="text.primary">
            Price: {price} €
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => alert(`You bought ${name} for ${price} €`)}
          >
            Buy
          </Button>
        </CardContent>
      </Card>
    );
  };
  

export default ProductList;