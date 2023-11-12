import React, { useState } from 'react';
import {
  Modal,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Product } from '../../types/ApiInterfaces';

const ProductModal = ({ product, open, onClose, handleBuy }: {
    product: Product,
    open: boolean,
    onClose: () => void,
    handleBuy: (quantity: number) => void,
}) => {

  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    handleBuy(quantity);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ width: 300, margin: 'auto', marginTop: 100 }}>
        <Card>
          <img src={product.imgURL} alt={product.name} style={{ width: '100%' }} />
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <IconButton onClick={handleDecrease}>
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6">{quantity}</Typography>
              <IconButton onClick={handleIncrease}>
                <AddIcon />
              </IconButton>
            </div>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" fullWidth onClick={handleAddToCart}>
              In den Warenkorb legen
            </Button>
          </CardActions>
        </Card>
      </div>
    </Modal>
  );
};

export default ProductModal;
