import { Box, Card, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material"
import { styled } from "@mui/system";

interface UserProfileProps {

}

const StyledUserProfile = styled(Grid)(({theme}) => ({
    padding: 50,
    width: 1000,
}));

const UserProfile: React.FC<UserProfileProps> = () => {
    const items: string[] =  [ "test1", "test2" ];

    return(
        <StyledUserProfile container spacing={5}> 
            {items.map((item, i) => 
                <AddressItem title={item}/>
            )}
        </StyledUserProfile>
    )
}

interface ProfileItemProps {
    children: React.ReactNode,
    title: string,
}

const StyledAccountItem = styled(Grid)(({theme}) => ({
  
}));

const ProfileItem: React.FC<ProfileItemProps> = ({children, title}) => {
    
    return (
        <StyledAccountItem item xs={12} sm={6}>
            <Card sx={{width: '400px'}}>
                <Typography>{title}</Typography>
                <Box sx={{display: 'flex'}}>
                    {children}
                </Box>
            </Card>
        </StyledAccountItem>
    )
}

const AddressItem = ({title} : {
    title: string
}) => {
    return(
        <ProfileItem title={title}>
            <CardMedia
              component="img"
              sx={{ width: 160, height: 160 }} // Adjust size as needed
              image={"https://cdn-icons-png.flaticon.com/512/7133/7133312.png"}
              alt={"orderProduct.productName"}
            />
            <CardContent sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                <Typography>
                    Name
                </Typography>
                <Typography>
                    Description
                </Typography>
            </CardContent>
        </ProfileItem>
    )
}

export default UserProfile;