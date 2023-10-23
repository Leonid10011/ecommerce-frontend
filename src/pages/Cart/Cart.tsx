import { Grid, Typography } from "@mui/material";
import { useData } from "../../context/dataContext";

export default function Cart() {

    const { products } = useData();

    return(
        <Grid container display={'flex'}>
            <Grid item display={'flex'} flexDirection={'column'}>
                {products.slice(0, 10).map((item, i) => {
                    return (
                        <Grid xs={6}>
                            <Typography>{item.name}</Typography>
                        </Grid>
                    )
                })}
            </Grid>
            <Grid item display={'flex'} flexDirection={'column'}>
                {
                    products.slice(0, 10).reduce((acc, cur) => acc + cur.price, 0)
                }
            </Grid>
        </Grid>
    )
}