import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useProduct } from '../../context/productContext';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
import { useOrder } from '../../context/orderContext';
import ProductCard from '../../components/common/ProductCard/ProductCard';

function ProductList() {
    const { isAuthenticated } = useAuth();
    const { order, addOrderItem } = useOrder();
    const navigation = useNavigate();

    const { filterFavoriteItems } = useProduct();

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

    const { favoriteItemsFiltered, nonFavoriteItems } = filterFavoriteItems;

    return (
      <Container maxWidth="sm" sx={{ position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
          {favoriteItemsFiltered.map((product, index) => (
            <ProductCard key={product.id} product={product} handleBuy={handleBuy} isFavorite/>
          ))}
          {nonFavoriteItems.map((product, index) => (
            <ProductCard key={product.id} product={product} handleBuy={handleBuy} isFavorite={false}/>
          ))}
        
      </Container>
    );
  }
  

export default ProductList;