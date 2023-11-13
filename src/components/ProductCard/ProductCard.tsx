// ProductCard.tsx
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Card, CardContent, Typography } from '@mui/material';
import ProductModal from '../ProductModal/ProductModal';
import { FavoriteProduct, Product } from '../../types/ApiInterfaces';
import CustomIconButton from '../common/CustomIconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { config } from '../../config';
import { FilteredFavoriteProduct } from '../../hooks/useFavoriteProducts';

interface ProductCardProps {
  product: Product | FilteredFavoriteProduct,
  handleBuy: (id: number, price: number, quantity: number) => void,
  isFavorite: boolean,
  isAuthenticated: boolean,
  addFavoriteItem: (id: number) => void,
  deleteFavoriteItem: (id: number) => void,
}

const StyledCard = styled(Card)`
  border: 2px solid black;
  backgroundColor: black;
  margin-bottom: 5px;
  margin-top: 5px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const StyledCardContent = styled(CardContent)`
  position: relative;
  border-top: 1px solid grey;
  // Additional styles for card content
`;

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  handleBuy, 
  isFavorite,
  isAuthenticated,
  addFavoriteItem,
  deleteFavoriteItem 
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleFavoriteClick = () => {
    if(isFavorite){
      if('favoriteProductId' in product)
        deleteFavoriteItem(product.favoriteProductId);
    }
    else
      addFavoriteItem(product.id);
  }

  const handleAddToCartClick = () => {
    setModalOpen(true)
  }

  return (
    <StyledCard>
      <ImageContainer>
        {isAuthenticated && (
          <CustomIconButton 
            icon={<FavoriteIcon color={isFavorite ? 'error' : 'action'} />} 
            onClick={handleFavoriteClick} 
            top={10} 
            right={10} 
            ariaLabel="Toggle favorite"
          />
        )}
        <img 
          src={config.image_url + "/"+ product.imgURL} 
          alt={product.name} 
          style={{ width: '100%' }} 
      />
      </ImageContainer>
      <StyledCardContent>
        <Typography variant={'h1'} gutterBottom paragraph sx={{fontSize: '1.5rem'}}>
          {product.name}
        </Typography>
        <Typography variant={'h1'} component="div" gutterBottom paragraph sx={{fontSize: '1rem'}}>
          {product.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.price}€
        </Typography>
        <CustomIconButton 
          icon={<AddShoppingCartIcon />} 
          onClick={handleAddToCartClick} 
          bottom={10} 
          right={10} 
          border="1px solid black" 
          padding={15}
          ariaLabel="Add to cart"
      />
      </StyledCardContent>
      <ProductModal 
        product={product} 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        handleBuy={(quantity: number) => handleBuy(product.id, product.price, quantity)}
      />
    </StyledCard>
  );
};

export default ProductCard;