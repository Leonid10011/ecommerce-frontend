export const BasicListItemStyles = {
    
    display: "flex",
    flexDirection: 'row',
    border: "1px solid black",
    borderRadius: "20px",
    justifyContent: 'space-around',

    '@media (max-width: 768px)':{
        flexDirection: 'column',
    },
}

export const ListItemBoxStyles = {
    display: "flex",
    flexDirection: 'column',
    backgroundColor: 'pink',
    '@media (max-width: 768px)':{
        flexDirection: 'row',
    },
}

export const ListItemTextStyles = {
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    backgroundColor: "red"
}