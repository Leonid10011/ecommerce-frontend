import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useData } from '../../context/productContext';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
import { useOrder } from '../../context/orderContext';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import { useInit } from '../../context/initContext';

function ProductList() {
    const { isAuthenticated } = useAuth();
    const { doOrder } = useInit();
    const { orderId } = useOrder();
    const navigation = useNavigate();

    const { filterFavoriteItems } = useData();

    const handleBuy = (id: number, price: number, quantity: number) => {
      if(isAuthenticated){
        const item = {
          orderId: orderId, 
          productId: id, 
          quantity: quantity, 
          price: price
        }
        console.log(id)
        doOrder(item);  
      }
      else {
        navigation("/signin")
      }
    } 
    
    useEffect(() => {
     // console.log("Init Products.\nProdcuts ", products);

    }, [])

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