import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { config } from "../../config";
import { OrderItemResponseDTO } from "../../api/orderApi";
import { useProducts } from "../../context/ProductContext";

export default function Cart() {
  
    const { orderProducts } = useProducts();

    return(
        <Grid container display={'flex'} maxWidth='sm' flexDirection={'column'} >
            <Grid item display={'flex'} flexDirection={'column'} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <SumCard  sum={orderProducts.reduce((acc, cur) => acc + cur.orderedPrice, 0)} />
            </Grid>
            <Grid item display={'flex'} flexDirection={'column'} >
                {orderProducts.map((item, i) => {
                    return (
                        <CartCard key={item.imageURL} orderProduct={item}/>
                    )
                })}
            </Grid>
            
        </Grid>
    )
}

const CartCard = ({ orderProduct }: {orderProduct: OrderItemResponseDTO}) => {

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
          image={config.image_url +  orderProduct.imageURL}/>
        <CardContent>
          <Box display={'flex'} flexDirection={'row'}>
            <Box>
              <Typography variant="h5" component="div" sx={{fontSize: '1rem'}}>
                {orderProduct.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{fontSize: '1rem'}}>
                {orderProduct.productDescription}
              </Typography>
              <Typography variant="body2" sx={{fontSize: '1rem'}}>
                {orderProduct.orderedPrice} €
              </Typography>
            </Box>
            <Box flexGrow={1}>
              <Typography textAlign={'center'}>
                Anzahl: {orderProduct.orderedQuantity}
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
            {/* {sum.toFixed(2)}€   */}
            </Typography>  
            <Button variant="contained" size="small" color="primary" onClick={notify} >
              {/* Todo */}
                Checkout
            </Button>
            </CardContent>
        </Card>
    );
  }