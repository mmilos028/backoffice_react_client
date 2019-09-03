import { Theme, createStyles } from '@material-ui/core';

const StatusStyle = (theme: Theme) => createStyles({  
  redStyle: {
    color: "#ffffff",
    backgroundColor: "red",
    padding: "3px 3px 3px 3px"    
  },
  greenStyle: {
    color: "#ffffff",
    backgroundColor: "green",
    padding: "3px 3px 3px 3px"    
  }, 
  blueStyle: {
    color: "#ffffff",
    backgroundColor: "#2196f3",
    padding: "3px 3px 3px 3px"
  },
  orangeStyle: {
    color: "#ffffff",
    backgroundColor: "orange",
    padding: "3px 3px 3px 3px"
  }
});

export { StatusStyle };