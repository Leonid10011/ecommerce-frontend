export const BasicListItemStyles = {
    
    display: "flex",
    flexDirection: 'row',
    border: "1px solid black",
    borderRadius: "20px",

    '@media (max-width: 768px)':{
        flexDirection: 'column',
    },
}

export const ListItemTextStyles = {
    display: "flex",
    flexDirection: 'column',

    '@media (max-width: 768px)':{
        flexDirection: 'row',
    },
}