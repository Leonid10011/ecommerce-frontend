import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { OrderProductType, useOrder } from "../../context/orderContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { Product } from "../../api/productApi";
import { OrderItemDTO } from "../../api/dataApi";

export default function Cart() {

    const { filterOrderItems } = useOrder();

    return(
        <Grid container display={'flex'} maxWidth='sm' flexDirection={'column'} >
            <Grid item display={'flex'} flexDirection={'column'} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <SumCard  sum={filterOrderItems.reduce((acc, cur) => acc + cur.price, 0)} />
            </Grid>
            <Grid item display={'flex'} flexDirection={'column'} >
                {filterOrderItems.map((item, i) => {
                    return (
                        <CartCard key={item.id} orderProduct={item}/>
                    )
                })}
            </Grid>
            
        </Grid>
    )
}

const CartCard = ({ orderProduct }: {orderProduct: OrderProductType}) => {

    const [amount, setAmount] = useState<number>(0);

    const handleAdd = () => {
      setAmount(prev => prev + 1);
    }

    const handleSub = () => {
      setAmount(prev => prev > 0 ? prev - 1 : 0);
    }

    return (
      <Card sx={{m: 2}}>
        <CardMedia 
          component="img"
          image={orderProduct.imgURL}/>
        <CardContent>
          <Box display={'flex'} flexDirection={'row'}>
            <Box>
              <Typography variant="h5" component="div" sx={{fontSize: '1rem'}}>
                {orderProduct.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{fontSize: '1rem'}}>
                {orderProduct.description}
              </Typography>
              <Typography variant="body2" sx={{fontSize: '1rem'}}>
                {orderProduct.price} €
              </Typography>
            </Box>
            <Box flexGrow={1}>
              <Typography textAlign={'center'}>
                Anzahl: {orderProduct.quantity}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };
  const SumCard = ({sum} : {
    sum: number
  }) => {
    
    const notify = () => {
      toast.error("Not implemented yet!", {
        position: 'top-center'
      });
    };

    return (
        <Card>
            <CardContent>
            <Typography>
                TotalSum:
            </Typography>
            <Typography>
            {sum.toFixed(2)}€  
            </Typography>  
            <Button variant="contained" size="small" color="primary" onClick={notify} >
              {/* Todo */}
                Checkout
            </Button>
            </CardContent>
        </Card>
    );
  }