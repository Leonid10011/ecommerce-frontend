import { Box, Button, Card, Grid, Typography, styled } from "@mui/material";
import { useProducts } from "../../context/ProductContext";
import CartCard from "../../components/CartCard/CartCard";
import { OrderItemResponseDTO } from "../../types/ApiInterfaces";
import { Height } from "@mui/icons-material";


const StyledCart = styled(Box)(({theme}) => ({
  display: 'flex',
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse'
  }
}));

const StyledCheckout = styled(Card)(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  maxHeight: 200,
  margin: '16px',
  [theme.breakpoints.up('sm')]: {
    width: 150,
  }
}));

const StyledItem = styled(Box)`

`;

const StyledItemList = styled(Box)`

`;

const StyledButton = styled(Button)(({theme}) => ({
  height: '40px',
  width: '100px',
  [theme.breakpoints.down('sm')]: {
    width: '160px',
  }
}));

const calculateSum = (products: OrderItemResponseDTO[]) => {
  return products.map(product => product.orderedPrice * product.orderedQuantity)
    .reduce((acc: number, cur: number) => acc + cur, 0);
}

function Cart() {
    const { orderProducts } = useProducts();

    return(
      <StyledCart maxWidth='sm'>
        <StyledItemList>
            {orderProducts.map((item, i) => {
                return (
                  <StyledItem key={i}>
                    <CartCard key={item.imageURL} orderProduct={item}/>
                  </StyledItem>
                    )
                  })}
          </StyledItemList>
          <StyledCheckout>
            <Typography variant="h6">
                  Sum: {calculateSum(orderProducts)}
            </Typography>
            <StyledButton variant="contained" size="small" color="primary">
              Checkout
            </StyledButton>
          </StyledCheckout>
      </StyledCart>
    )
};

export default Cart;