import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React from "react";
import { BasicListItemStyles, ListItemTextStyles, ListItemBoxStyles } from "./style";

export default function BasicListItem(props: {listItem: {
    name: string,
    imgSrc: string,
    price: string,
}}){

    return(
        <ListItem sx={BasicListItemStyles}>
            <ListItemAvatar>
                <div>
                    <img src={props.listItem.imgSrc} />
                </div>
            </ListItemAvatar>
            <Box sx={ListItemBoxStyles}>
                <ListItemText primary={props.listItem.name} primaryTypographyProps={{variant: "h6"}} sx={ListItemTextStyles}/>
                <ListItemText primary={props.listItem.price} primaryTypographyProps={{variant: "body2"}}/>
            </Box>
        </ListItem>
    );
}