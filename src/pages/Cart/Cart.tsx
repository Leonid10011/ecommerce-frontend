import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, Grid, StepIcon, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from "@mui/material";
import { useOrder } from "../../context/orderContext";
import FavoriteIcon from '@mui/icons-material/Favorite';
//import { ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { PlusOne } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Cart() {

    const { items } = useOrder();
    const isMobile = useMediaQuery('(max-width: 768px');

    return(
        <Grid container display={'flex'} maxWidth='xs' flexDirection={isMobile ? 'column' : 'row'}>
            <Grid item display={'flex'} flexDirection={'column'} >
                {items.slice(0, 10).map((item, i) => {
                    return (
                        <CartCard name={item.name} description={item.description} price={item.price}/>
                    )
                })}
            </Grid>
            <Grid item display={'flex'} flexDirection={'column'} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <SumCard  sum={items.reduce((acc, cur) => acc + cur.price, 0)} />
            </Grid>
        </Grid>
    )
}

const CartCard = ({ name, description, price }: {
    name: string,
    description: string,
    price: number,
}) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

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
          height="150"
          width="50"
          image="/test2.jpeg"/>
        <CardContent>
          <Typography variant="h5" component="div" sx={{fontSize: '1rem'}}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{fontSize: '1rem'}}>
            {description}
          </Typography>
          <Typography variant="body2" sx={{fontSize: '1rem'}}>
            {price} €
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon/>
          </IconButton>
          <ToggleButtonGroup
            size="small"
            value={"center"}
            >
            <ToggleButton 
              value={"left"}
              onClick={handleAdd}
              >
                <AddIcon/>
              </ToggleButton>
              <ToggleButton value={"center"}>
                <Typography>
                  {amount}
                </Typography>
              </ToggleButton>
              <ToggleButton 
                value={"right"}
                onClick={handleSub}>
                <RemoveIcon/>
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
                {sum}
            </Typography>  
            <Button variant="contained" size="small" color="primary"  >
                Checkout
            </Button>
            </CardContent>
        </Card>
    );
  }