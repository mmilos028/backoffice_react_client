import React from "react";
import classNames from "classnames";
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import { StatusStyle } from './StatusStyle';

class Status extends React.Component {

    static propTypes = {
        contentText: PropTypes.string.isRequired,
        color: PropTypes.oneOf(['red', 'green', 'blue', 'orange'])
    }

    constructor(props){

      super(props);
    }
  
    render(){  
        return (
            <div>
                { this.props['color'] == 'red' && 
                <span className={this.props['classes'].redStyle}>{this.props['contentText']}</span> }
                { this.props['color'] == 'green' && 
                <span className={this.props['classes'].greenStyle}>{this.props['contentText']}</span> }
                { this.props['color'] == 'blue' && 
                <span className={this.props['classes'].blueStyle}>{this.props['contentText']}</span> }
                { this.props['color'] == 'orange' && 
                <span className={this.props['classes'].orangeStyle}>{this.props['contentText']}</span> }
            </div>
        )
    }
  }

  export default withStyles(StatusStyle)(Status);