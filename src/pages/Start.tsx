import React from "react";
import SlidingComponent from "../components/SlideWindow/SlideWindow";
import BasicCard from "../components/common/BasicCard/BasicCard";
import { Grid } from "@mui/material";
import { startStyles } from "./styles";

export default function Start(){

    return(
        <Grid container sx={startStyles}>
            <SlidingComponent children={<BasicCard imgSrc="/test2.jpeg"/>}/>
            <SlidingComponent children={<BasicCard imgSrc="/test2.jpeg"/>}/>
        </Grid>
    )
}