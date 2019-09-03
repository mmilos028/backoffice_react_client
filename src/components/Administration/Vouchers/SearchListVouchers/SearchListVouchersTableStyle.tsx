import { Theme, createStyles } from '@material-ui/core';


const SearchListVouchersTableStyle = (theme: Theme) => createStyles({
    tableResponsive: {
        width: "100%",
        marginTop: 0,
        overflowX: "auto",
        backgroundColor: "white"
    },
    table: {
        maxHeight: '80vh',
        overflow: 'scroll',
    },
    tableCell: {
        fontSize: '14px'
    },    
    tableHeadCell: {
        fontSize: '14px',
        position: "sticky",
        top: 0
    },
    searchWrapper: {
        margin: "10px 0 10px 0",
        [theme.breakpoints.down("sm")]: {
            margin: "10px 0 10px 0",
        },
        display: "block",
        position: "relative",
        width: "100%",
        height: 50
    },
    filterSearchWrapper: {
        margin: "10px 0 10px 0",
        [theme.breakpoints.down("sm")]: {
            margin: "10px 0 10px 0"
        },
        display: "block",
        position: "relative",
        width: "100%",
        minHeight: 50
    },
    tableWrapper: {
        margin: "10px 0 10px 0",
        display: "block",
        position: "relative",
        width: "100%"
    },
    leftAlign: {
        display: "inline-block",
        left: 0
    },
    centerAlign: {
        display: "inline-block",
        left: "33%",
        position: "relative",
    },
    rightAlign:{
        display: "inline-block",
        float: "right",
        right: 0
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: 8,
        flex: 1,
        border: "1px solid silver"
    },
    iconButton: {
        padding: 5,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
    formControl: {
        margin: 1,
        /*minWidth: 270,*/
        width: '100%'
    },
});

export default SearchListVouchersTableStyle;