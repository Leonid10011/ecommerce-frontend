import { Box } from "@mui/system";
import { css } from '@emotion/react'; 
import styled from '@emotion/styled'; 

import React from "react";

export default function Header(props: {title: string}){

    const boxStyles = css`
        width: 100%;
        color: red;
        backgroundColor: yellow;
    `

    const HeaderBox = styled(Box)`
        ${boxStyles}
    `

    return(
        <HeaderBox >
            <h1>{props.title}</h1>
        </HeaderBox>
    );
}