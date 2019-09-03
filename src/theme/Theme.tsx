import { createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import { white } from 'material-ui/styles/colors';

const Theme = createMuiTheme({
  palette: {
    primary: blue, 
    /*
    primary: {
      main: "#607D8B"        
    },
    */   
    secondary: pink,
    error: red        
  },  

  overrides: {
    MuiAppBar: {
      root: {
        color: white,
        backgroundColor: '#607D8B',
      }      
    },

  },  
  typography: {
    useNextVariants: true,
  }
});

export default Theme;