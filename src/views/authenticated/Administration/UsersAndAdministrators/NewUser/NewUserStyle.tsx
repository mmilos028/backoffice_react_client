import { Theme, createStyles } from '@material-ui/core';


const NewUserStyle = (theme: Theme) => createStyles({
    content: {
        width: 800
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    },
    cancel: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit * 3
    },
    rightFormButtonsAlign: {    
        marginRight: 10,
        marginLeft: 'auto'
    },
    validationMessage: {
        fontSize: 18
    },
    successMessage: {
        color: 'green',
        fontSize: 18
    },
    errorMessage: {
        color: 'red',
        fontSize: 18
    }
});

export default NewUserStyle;