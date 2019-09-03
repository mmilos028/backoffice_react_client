import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import SearchListVouchersTable from '../../../../../components/Administration/Vouchers/SearchListVouchers/SearchListVouchersTable';
import SearchListVouchersStyle from "./SearchListVouchersStyle";

import { DEBUG_CONSOLE } from "../../../../../configuration/Config";

class SearchListVouchers extends React.Component {

  classes = null;

  static propTypes = {  
    session: PropTypes.object,
  }

  constructor(props, context)
  {    
    super(props, context);

    if(DEBUG_CONSOLE){
      console.log("SearchListVouchers::constructor");
    }

    this.classes = props.classes;

  }

  componentDidMount(){
    if(DEBUG_CONSOLE){
      console.log("SearchListVouchers::componentDidMount");
    }
  }

  componentWillUnmount(){
    if(DEBUG_CONSOLE){
      console.log("SearchListVouchers::componentWillUnmount");
    }
  }

  render() {

    if(DEBUG_CONSOLE){
      console.log("SearchListVouchers::render");
    }

    return (
        <div className={this.classes.tableContainer}>
            {
              <SearchListVouchersTable />
            }
        </div>
    );
  }
}

export default withStyles(SearchListVouchersStyle)(injectIntl(SearchListVouchers));