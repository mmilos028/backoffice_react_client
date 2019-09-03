import { Theme, createStyles } from '@material-ui/core';


const CreateVoucherCardStyle = (theme: Theme) => createStyles({
    content: {
        width: 600
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
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

export default CreateVoucherCardStyle;