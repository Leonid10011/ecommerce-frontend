import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, Grid, StepIcon, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from "@mui/material";
import { OrderProductType, useOrder } from "../../context/orderContext";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from "react";
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Product } from "../../context/dataContext";

export default function Cart() {

    const { orderItems } = useOrder();
    const isMobile = useMediaQuery('(max-width: 768px');

    return(
        <Grid container display={'flex'} maxWidth='xs' flexDirection={isMobile ? 'column' : 'row'}>
            <Grid item display={'flex'} flexDirection={'column'} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <SumCard  sum={orderItems.reduce((acc, cur) => acc + cur.price, 0)} />
            </Grid>
            <Grid item display={'flex'} flexDirection={'column'} >
                {orderItems.slice(0, 10).map((item, i) => {
                    return (
                        <CartCard key={item.id} product={item}/>
                    )
                })}
            </Grid>
            
        </Grid>
    )
}

const CartCard = ({product}: {product: OrderProductType}) => {
    const [expanded, setExpanded] = useState<boolean>(false);

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
          image="https://cdn.pixabay.com/photo/2022/08/28/01/32/dreaming-7415565_640.jpg"/>
        <CardContent>
          <Typography variant="h5" component="div" sx={{fontSize: '1rem'}}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{fontSize: '1rem'}}>
            {product.description}
          </Typography>
          <Typography variant="body2" sx={{fontSize: '1rem'}}>
            {product.price} €
          </Typography>
        </CardContent>
        <CardActions>
          <ToggleButtonGroup
            size="small"
            value={"center"}
            >
              <ToggleButton value={"center"}>
                <Typography>
                  {product.quantity}
                </Typography>
              </ToggleButton>
          </ToggleButtonGroup>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography>
              Cardcontent
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  };

  const SumCard = ({sum} : {
    sum: number
  }) => {
    
    return (
        <Card>
            <CardContent>
            <Typography>
                {sum.toFixed(2)}
            </Typography>  
            <Button variant="contained" size="small" color="primary"  >
                Checkout
            </Button>
            </CardContent>
        </Card>
    );
  }