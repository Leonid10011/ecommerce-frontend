import React, { useState } from 'react';
import { Box, Card, CardContent, CardHeader, IconButton, Modal, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ProductModal from '../../ProductModal/ProductModal';
import { useAuth } from '../../../context/authContext';
import { createFavoriteItem } from '../../../api/dataApi';
import { Product, useData } from '../../../context/dataContext';
import { useInit } from '../../../context/initContext';

// Style for modal
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export interface PType {
    name: string,
    price: number,
    image: string,
    isFavorite: boolean,
}

const ProductCard = ({ product, handleBuy } : { product: Product, handleBuy: (id: number, price: number, quantity: number) => void}) => {
    const [modal, setModal] = useState<boolean>(false);

    const { doFavorite } = useInit();

  const handleCartClick = () => {
    // Implementiere die Logik zum Hinzufügen des Produkts zum Warenkorb hier
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
  }

  const handleFavoriteClick = () => {
    doFavorite(product);
  }

  return (
    <Card >
      <div style={{ position: 'relative'}}>
        <IconButton
          style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'white' }}
          onClick={handleFavoriteClick}
        >
          <FavoriteIcon color={product.isFavorite ? 'error' : 'action'} />
        </IconButton>
        <img src={"http://85.215.54.122/images/hoodie_01_sm.png"} alt={product.name} style={{ width: '100%'}} />
      </div>
      <CardContent style={{ position: 'relative' }}>
        <Typography variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.price}€
        </Typography>
        <IconButton
          style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'white', border: '1px solid grey', padding: "15px" }}
          onClick={handleCartClick}
        >
          <AddShoppingCartIcon />
        </IconButton>
      </CardContent>
      <ProductModal product={product} open={modal} onClose={handleClose} handleBuy={(quantity: number) => handleBuy(product.id, product.price, quantity)}/>
    </Card>
  );
};

export default ProductCard;
