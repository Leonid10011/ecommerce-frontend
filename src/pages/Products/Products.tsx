import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useData } from '../../context/dataContext';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
import { useOrder } from '../../context/orderContext';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import { useInit } from '../../context/initContext';

function ProductList() {
    //const isLargeScreen = useMediaQuery('(min-width: 768px');
    const { products } = useData();
    const { isAuthenticated } = useAuth();
    const { doOrder } = useInit();
    const { orderId } = useOrder();
    const navigation = useNavigate();

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
      console.log("Init Products.");
    }, [])

    return (
      <Container maxWidth="sm" sx={{ position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} handleBuy={handleBuy}/>
          ))}
        
      </Container>
    );
  }
  

export default ProductList;