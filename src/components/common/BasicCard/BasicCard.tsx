import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { css } from '@emotion/react'; // Importiere css aus @emotion/react
import styled from '@emotion/styled'; //
import React from "react";
import { cardStyles } from "./styles";

export default function BasicCard(props: {imgSrc: string}){

    return(
        <Card sx={cardStyles}>
            <CardMedia
                component="img"
                sx={{height: 200, width: 200}}
                image={props.imgSrc}
                title={"test"}
                alt={"test"}
            />
            <CardContent>
                <Typography>
                    Item
                </Typography>
                <Typography>
                    Price
                </Typography>
            </CardContent>
        </Card>
    )
}