import { Box } from "@mui/system";
import { css } from '@emotion/react'; 
import styled from '@emotion/styled'; 
import { Typography } from "@mui/material";

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
            <Typography variant="h4" align="center" mt={2}>{props.title}</Typography>
        </HeaderBox>
    );
}