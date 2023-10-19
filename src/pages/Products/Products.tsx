import { Box, List, ListItem } from "@mui/material";
import React from "react";
import BasicListItem from "../../components/common/BasicListItem/BasicListItem";
import BasicList from "../../components/common/BasicList/BasicList";
import { ProductStyles } from "./styles";

export default function Products(){
    const exampleItems = [
        {
            name: "item 1",
            price: "10.00",
            imgSrc: "/test2.jpeg"
        },
        {
            name: "item 2",
            price: "50.00",
            imgSrc: "/test2.jpeg"
        },
        {
            name: "item 3",
            price: "150.00",
            imgSrc: "/test2.jpeg"
        },
        {
            name: "item 4",
            price: "590.00",
            imgSrc: "/test2.jpeg"
        },
        {
            name: "item 5",
            price: "52190.00",
            imgSrc: "/test2.jpeg"
        },
        {
            name: "item 6",
            price: "521902.00",
            imgSrc: "/test2.jpeg"
        },
        {
            name: "item 7",
            price: "5219032.00",
            imgSrc: "/test2.jpeg"
        },
        {
            name: "item 8",
            price: "52123190.00",
            imgSrc: "/test2.jpeg"
        }
    ]

    return(
            <Box sx={ProductStyles}>
                <BasicList listItems={exampleItems}/>        
            </Box>

    );
}