import React from "react";
import SlidingComponent from "../components/SlideWindow/SlideWindow";
import { Box, Container, Typography } from "@mui/material";

export default function Start(){

    return(
        <Container maxWidth="sm">
            <p style={{
                border: "2px solid black",
                borderRadius: "5px",
                backgroundColor:"grey",
                padding:2
            }}>
            In this area, we will feature sales and new products soon. Still under construction. For now, enjoy the photos.
            </p>
            <SlidingComponent/>
        </Container>
    )
}