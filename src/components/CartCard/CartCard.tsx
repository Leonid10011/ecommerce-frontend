import { Box, Card, CardContent, CardMedia, Typography, styled } from "@mui/material";
import { OrderItemResponseDTO } from "../../types/ApiInterfaces";
import { config } from "../../config";

const StyledCartCard = styled(Card)`
`;

interface CartCardProps {
    orderProduct: OrderItemResponseDTO;
}

const CartCard: React.FC<CartCardProps> = ({orderProduct}) => {
    return (
      <StyledCartCard sx={{ display: 'flex', margin: 2, padding: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 100, height: 160 }} // Adjust size as needed
              image={config.image_url + orderProduct.imageURL}
              alt={orderProduct.productName}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {orderProduct.productName}
            </Typography>
            <Typography variant="body1">
              {`Price: ${orderProduct.orderedPrice}`}
            </Typography>
            <Typography variant="body1">
              {`Quantity: ${orderProduct.orderedQuantity}`}
            </Typography>
          </Box>
        </Box>
      </StyledCartCard>
    );
  };

export default CartCard;