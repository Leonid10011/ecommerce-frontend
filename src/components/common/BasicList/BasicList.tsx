import React from "react";
import { BasicListStyles } from "./styles";
import { List } from "@mui/material";
import BasicListItem from "../BasicListItem/BasicListItem";

interface ListItem {
    name: string,
    price: string,
    imgSrc: string
}

export default function BasicList(props: {listItems: ListItem[]}){

    return(
        <List sx={BasicListStyles}>
            {
                props.listItems.map((item, i) => 
                    <BasicListItem key={i} listItem={item}/>
                )
            }
        </List>
    );
}