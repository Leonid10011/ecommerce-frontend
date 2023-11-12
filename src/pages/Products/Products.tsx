import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
import { useOrder } from '../../context/orderContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useProducts } from '../../context/ProductContext';

function ProductList() {
    const { isAuthenticated } = useAuth();
    const { order, addOrderItem } = useOrder();
    const { addFavoriteItem, deleteFavoriteItem, favoriteProductsFiltered } = useProducts();
    const navigation = useNavigate();

    // Need to be reworked
    const handleBuy = (id: number, price: number, quantity: number) => {
      if(isAuthenticated){
        const item = {
          id: 0,
          orderId: order.id, 
          productId: id, 
          quantity: quantity, 
          price: price
        }
        addOrderItem(item);
      }
      else {
        navigation("/signin")
      }
    } 

    return (
      <Container maxWidth="sm" sx={{ position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
          {favoriteProductsFiltered.favoriteProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} handleBuy={handleBuy} isFavorite isAuthenticated={isAuthenticated} addFavoriteItem={addFavoriteItem} deleteFavoriteItem={deleteFavoriteItem} />
          ))}
          {favoriteProductsFiltered.nonFavoriteProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} handleBuy={handleBuy} isFavorite={false} isAuthenticated={isAuthenticated} addFavoriteItem={addFavoriteItem} deleteFavoriteItem={deleteFavoriteItem}/>
          ))}
        
      </Container>
    );
  }
  

export default ProductList;