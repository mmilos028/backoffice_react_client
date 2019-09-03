import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import SearchIcon from '@material-ui/icons/Search';
// core components
import SearchListVouchersTableStyle from "./SearchListVouchersTableStyle";
import { FormattedMessage, injectIntl } from "react-intl";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { 
  listReportAction,
  listReportFulfilledStatusAction, 
  listReportPendingStatusAction, 
  listReportRejectedStatusAction 
} from "../../../../redux/actions/report/ReportActions";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { DEBUG_CONSOLE } from "../../../../configuration/Config";
import NumberHelper from "../../../../helpers/NumberHelper";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { InputLabel } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';

import FilterListIcon from '@material-ui/icons/FilterList';

import Status from '../../../Status/Status';

import { searchListVouchersService, 
  listAvailableAmountsService,
  listAvailableCurrencyService,
  listAvailableStatusesService,
  listAffiliateCreatorsService,
  listAffiliateOwnersService,
  listUsedByPlayerService
} 
  from "../../../../redux/services/administration/vouchers/VouchersService"; 

import Fab from '@material-ui/core/Fab';

import Hidden from '@material-ui/core/Hidden';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';

import DateTimeHelper from "../../../../helpers/DateTimeHelper";

class SearchListVouchersTable extends React.Component {

  classes = null;

  searchTerm = '';

  openSearchFilterForm = false;

  state = {
    order: 'asc',
    orderBy: 'serial_number',
    page: 1,
    rowsPerPage: 10,
    tableData: [],
    filterTableData: [],
    countFilterTableData: 0,
    hiddenColumns: {
      card_type: false,
      serial_number: false,
      amount: false,
      currency: false,
      refill_type: false,
      status: false,
      create_affiliate: false,
      create_date: false,
      affiliate_owner: false,
      player_used: false,
      date_of_use: false,
      member_id: false,
      username: false,
      refill_allowed: false,
      deactivated_after_spent: false,
      expiry_date: false,
      voucher_code: false
    },
    filterFields: {
      card_type: '',
      serial_number: '',
      created_by: { affiliate_creator: '', creator_name: "Select Created By" },
      date_of_use: null,
      promo_card: { value: '', text: '' },
      amount: { value: '', text: "Select Amount" },
      created_date: null,
      username: '',
      refill_status: { value: '', text: "" },
      currency: { ics: "", id: '', description: "Select Currency" },
      affiliate_owner: { affiliate_owner: '', owner_name: "Select Created By" },
      expire_before: null,
      status: '',
      used_by_player: { used_by_player_id: '', player_used_by_name: '' },
      expire_after: null,
    },

    list_available_amounts: [
      {
        text: '',
        value: <FormattedMessage id="Select Amount" defaultMessage="Select Amount" />,
      }
    ],
    list_available_currency: [
      {
        ics: '',
        id: '',
        description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" />,
      }
    ],
    list_created_by_users: [      
    ],
    list_available_statuses: [
      {
        text: '',
        value: '',
      }
    ],
    list_affiliate_owners: [      
    ],
    list_used_by_player: [
      { used_by_player_id: '', player_used_by_name: '' }
    ],
    list_promo_cards: [
      {
        text: '',
        value: '',
      }
    ],
    list_refill_status: [
      {
        text: '',
        value: ''
      }
    ],

    anchorElVisibleColumns: null,    
  };

  mapColumnIndex = {
    "0": "card_type",
    "1": "serial_number",
    "2": "amount",
    "3": "currency",
    "4": "refill_type",
    "5": "status",
    "6": "create_affiliate",
    "7": "create_date",
    "8": "affiliate_owner",
    "9": "player_used",
    "10": "date_of_use",
    "11": "member_id",
    "12": "username",
    "13": "refill_allowed",
    "14": "deactivated_after_spent",
    "15": "expiry_date",
    "16": "voucher_code",
  }
  __is_mounted = true;
  
  static propTypes = {
    classes: PropTypes.object.isRequired,

    list_report_pending_status: PropTypes.bool,
    list_report_fulfilled_status: PropTypes.bool,
    list_report_rejected_status: PropTypes.bool,

    listReportAction: PropTypes.func.isRequired,
    listReportPendingStatusAction: PropTypes.func.isRequired,
    listReportFulfilledStatusAction: PropTypes.func.isRequired,
    listReportRejectedStatusAction: PropTypes.func.isRequired,
    session: PropTypes.object,
    report: PropTypes.object,
  };

  constructor(props, context)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::constructor");
    }
    super(props, context);

    this.classes = props.classes;
    //this.tableData = props.tableData;

    this.createSortHandler = this.createSortHandler.bind(this);
    this.compareSort = this.compareSort.bind(this);
    this.filterButtonClick = this.filterButtonClick.bind(this);
    this.handleSearchFilter = this.handleSearchFilter.bind(this);
    this.filterSearchList = this.filterSearchList.bind(this);
    this.keyPressOnSearchField = this.keyPressOnSearchField.bind(this);
    this.handleGenerateReportButtonClick = this.handleGenerateReportButtonClick.bind(this);
    this.handleVisibleColumnsClick = this.handleVisibleColumnsClick.bind(this);
    this.handleCloseVisibleColumnsMenu = this.handleCloseVisibleColumnsMenu.bind(this);
    this.changeVisibleColumnStatus = this.changeVisibleColumnStatus.bind(this);
    this.handleResetColumnStatus = this.handleResetColumnStatus.bind(this);
    this.handleTurnOnAllColumnStatus = this.handleTurnOnAllColumnStatus.bind(this);
  
    this.handleChangeAmountFilter = this.handleChangeAmountFilter.bind(this);

    this.handleChangeTextField = this.handleChangeTextField.bind(this);

    this.handleChangeCreatedDateFilter = this.handleChangeCreatedDateFilter.bind(this);
    this.handleChangeDateOfUseFilter = this.handleChangeDateOfUseFilter.bind(this);
    this.handleChangeExpireBeforeFilter = this.handleChangeExpireBeforeFilter.bind(this);
    this.handleChangeExpireAfterFilter = this.handleChangeExpireAfterFilter.bind(this);    
    this.handleChangeCurrencyFilter = this.handleChangeCurrencyFilter.bind(this);
    this.handleChangeStatusFilter = this.handleChangeStatusFilter.bind(this);
    this.handleChangeCreatedByFilter = this.handleChangeCreatedByFilter.bind(this);
    this.handleChangeAffiliateOwnerFilter = this.handleChangeAffiliateOwnerFilter.bind(this);
    this.handleChangeUsedByPlayerFilter = this.handleChangeUsedByPlayerFilter.bind(this);

    this.handleChangePromoCardFilter = this.handleChangePromoCardFilter.bind(this);
    this.handleChangeRefillStatusFilter = this.handleChangeRefillStatusFilter.bind(this);


    this.doSortingTable = this.doSortingTable.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);

    this.translateText = this.translateText.bind(this);
    
    this.state = {
      order: 'asc',
      orderBy: 'type',
      page: 1,
      rowsPerPage: 10,
      tableData: this.tableData, 
      filterTableData: this.tableData,
      hiddenColumns: {
        card_type: false,
        serial_number: false,
        amount: false,
        currency: false,
        refill_type: false,
        status: false,
        create_affiliate: false,
        create_date: false,
        affiliate_owner: false,
        player_used: false,
        date_of_use: false,
        member_id: false,
        username: false,
        refill_allowed: false,
        deactivated_after_spent: false,
        expiry_date: false,
        voucher_code: false
      },
      filterFields:{
        card_type: '',
        serial_number: '',
        created_by: { affiliate_creator: '', creator_name: "Select Created By" },
        date_of_use: null,
        promo_card: { value: '', text: "" },
        amount: { value: '', text: "Select Amount" },
        created_date: null,
        username: '',
        refill_status: { value: '', text: "" },
        currency: { ics: "", id: "", description: "Select Currency" },
        affiliate_owner: { affiliate_owner: '', owner_name: "Select Affiliate Owner" },
        expire_before: null,
        status: { value: '', text: "" },
        used_by_player: { used_by_player_id: '', player_used_by_name: '' },
        expire_after: null,
      },

      list_available_amounts: [
        {
          text: '',
          value: <FormattedMessage id="Select Amount" defaultMessage="Select Amount" />,
        }
      ],
      list_available_currency: [
        {
          ics: '',
          id: '',
          description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" />,
        }
      ],
      list_created_by_users: [
      ],
      list_affiliate_owners: [
      ],
      list_available_statuses: [
        {
          text: '',
          value: '',
        }
      ],
      list_used_by_player: [
        { used_by_player_id: '', player_used_by_name: '' }
      ],
      list_promo_cards: [
        {
          text: '',
          value: '',
        }
      ],
      list_refill_status: [
        {
          text: '',
          value: ''
        }
      ],

      anchorElVisibleColumns: null
    };
  }

  componentDidMount() 
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::componentDidMount");
    }
    
    this.__is_mounted = true; 
    this.loadData();  
  }

  componentWillUnmount() 
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::componentWillUnmount");
    }

    this.__is_mounted = false;
  }

  /**
   * Initial loading report, first time loading
   */
  loadData()
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::loadData");
    }

    const loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      user_id: this.props['session'].session.user_id,
      jwt_token: this.props['session'].session.jwt_token
    };

    this.props['listReportPendingStatusAction'](loginData);
    
    this.props['listReportAction'](loginData, searchListVouchersService)
    .then((response) => {
        this.props['listReportFulfilledStatusAction'](response.value);
        
        this.setState(
          {
            tableData: response.value,
            filterTableData: response.value,
            countFilterTableData: response.value.length
          }
        );
    })
    .catch((error) => {
        console.log(error);
        this.props['listReportRejectedStatusAction'](loginData);
    })
    ;

    listAvailableAmountsService(loginData)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }
        
        this.setState({
          list_available_amounts: [
            {
              value: '',
              text: <FormattedMessage id="Select Amount" defaultMessage="Select Amount" />
            },
            ...response.report
          ]
        });

        if(DEBUG_CONSOLE){
          console.log("SearchListVouchersTable :: loadData >>  listAvailableAmountsService");
          console.log(this.state.list_available_amounts);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });

    listAvailableCurrencyService(loginData)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }
        
        this.setState({
          list_available_currency: [
            {
              ics: '',
              id: '',
              description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" />
            },
            ...response.report
          ]
        });

        if(DEBUG_CONSOLE){
          console.log("SearchListVouchersTable :: loadData >>  listAvailableCurrencyService");
          console.log(this.state.list_available_currency);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });

    listAvailableStatusesService(loginData)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }
        
        this.setState({
          list_available_statuses: [
            {
              value: '',
              text: '',
            },
            ...response.report
          ]
        });

        if(DEBUG_CONSOLE){
          console.log("SearchListVouchersTable :: loadData >>  listAvailableStatusesService");
          console.log(this.state.list_available_statuses);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });

    listAffiliateCreatorsService(loginData)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }
        
        this.setState({
          list_created_by_users: [
            ...response.report
          ]
        });

        if(DEBUG_CONSOLE){
          console.log("SearchListVouchersTable :: loadData >>  listAffiliateCreatorsService");
          console.log(this.state.list_created_by_users);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });

    listAffiliateOwnersService(loginData)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }
        
        this.setState({
          list_affiliate_owners: [
            ...response.report
          ]
        });

        if(DEBUG_CONSOLE){
          console.log("SearchListVouchersTable :: loadData >>  listAffiliateOwnersService");
          console.log(this.state.list_affiliate_owners);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });

    listUsedByPlayerService(loginData)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }
        
        this.setState({
          list_used_by_player: [
            ...response.report
          ]
        });

        if(DEBUG_CONSOLE){
          console.log("SearchListVouchersTable :: loadData >>  listUsedByPlayerService");
          console.log(this.state.list_used_by_player);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });


    this.setState({
      list_refill_status: [
        {
          text: "",
          value: ""
        },
        {
          text: <FormattedMessage id="No" defaultMessage="No" />,
          value: 'N'
        },
        {
          text: <FormattedMessage id="Yes" defaultMessage="Yes" />,
          value: 'Y'
        }
      ]
    });

    this.setState({
      list_promo_cards: [
        {
          text: "",
          value: ""
        },        
        {
          text: <FormattedMessage id="No" defaultMessage="No" />,
          value: "REAL MONEY"
        },
        {
          text: <FormattedMessage id="Yes" defaultMessage="Yes" />,
          value: "PROMO MONEY"
        }
      ]
    });
  }
    
  compareSort(obj1, obj2) {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::compareSort");
    }
    const compareStr1 = obj1[this.mapColumnIndex[this.state.orderBy]];
    const compareStr2 = obj2[this.mapColumnIndex[this.state.orderBy]];
    
    if(this.state.order === 'asc'){
      if(compareStr1 > compareStr2){
        return 1;
      }
      if(compareStr1 < compareStr2){
        return -1;
      }
    }else{
      if(compareStr1 > compareStr2){
        return -1;
      }
      if(compareStr1 < compareStr2){
        return 1;
      }
    }
    return 0;
  }

  doSortingTable(property) {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::doSortingTable");
    }
    
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }    

    let tableData = this.state.tableData;
    if(this.state.order === 'asc'){
      tableData.sort((a,b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0)); 
    }else{
      tableData.sort((a,b) => (a[property] < b[property]) ? 1 : ((b[property] < a[property]) ? -1 : 0)); 
    }   

    this.setState(
      {
        order: order, 
        orderBy: orderBy,
        filterTableData: tableData
      }
    );
  }

  createSortHandler = property => event => {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::createSortHandler property = " + property);
    }
    this.doSortingTable(property);
  }

  doSortingTableNumeric(property) {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::doSortingTableNumeric");
    }
    
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }    

    let tableData = this.state.tableData;
    if(this.state.order === 'asc'){
      tableData.sort((a,b) => { return (parseFloat(a[property]) - parseFloat(b[property])) }); 
    }else{
      tableData.sort((a,b) => { return (parseFloat(b[property]) - parseFloat(a[property])) }); 
    }   

    this.setState(
      {
        order: order, 
        orderBy: orderBy,
        filterTableData: tableData
      }
    );
  }

  createSortHandlerNumeric = property => event => {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::createSortHandlerNumeric property = " + property);
    }
    this.doSortingTableNumeric(property);
  }

  /**
   * One search term report filtering
   */
  filterSearchList() {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::filterSearchList");
    }
    let filteredReportData = null;
    if(this.searchTerm === ''){
      filteredReportData = this.state.tableData;
      this.setState({
        filterTableData: filteredReportData
      });
    }else{
      filteredReportData = this.state.tableData
      .filter( row => {
          return (row.serial_number || '').toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 || 
          (row.amount || '').toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 ||
          (row.currency || '').toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 ||
          (row.refill_type || '').toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 ||
          (row.status || '').toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 ||
          (row.affiliate_creator || '').toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 ||
          (row.creation_date || '').toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1
          ;
      })      
      this.setState(
        { 
          filterTableData: filteredReportData
        }
      );
    }
  }

  filterButtonClick() 
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::filterButtonClick");
    }
    this.filterSearchList();
  }

  keyPressOnSearchField(event)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::keyPressOnSearchField");
    }
    if(event.keyCode === 13){
      this.searchTerm = event.target.value;
      this.filterSearchList();
    }
  }

  handleSearchFilter(event)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::handleSearchFilter");
    }

    this.searchTerm = event.target.value;
  }

  /**
   * Filter button click
   */
  handleFilterReportClick(event)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::handleFilterReportClick");
    }

    const filterData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token,
      page_number: this.state.page,
      per_page: this.state.rowsPerPage,

      serial_number: this.state.filterFields.serial_number,
      created_by: this.state.filterFields.created_by.affiliate_creator,
      date_of_use: DateTimeHelper.getFormattedDateFromDatePickerVouchers(this.state.filterFields.date_of_use),
      promo_card: this.state.filterFields.promo_card.value,
      amount: this.state.filterFields.amount.value,
      created_date: DateTimeHelper.getFormattedDateFromDatePickerVouchers(this.state.filterFields.created_date),
      username: this.state.filterFields.username,
      refill_status: this.state.filterFields.refill_status.value,
      currency: this.state.filterFields.currency.ics,
      affiliate_owner: this.state.filterFields.affiliate_owner.affiliate_owner,
      expire_before: DateTimeHelper.getFormattedDateFromDatePickerVouchers(this.state.filterFields.expire_before),
      status: this.state.filterFields.status.value,
      used_by_player: this.state.filterFields.used_by_player.used_by_player_id,
      expire_after: DateTimeHelper.getFormattedDateFromDatePickerVouchers(this.state.filterFields.expire_after)
    };

    this.props['listReportPendingStatusAction'](filterData);
    
    this.props['listReportAction'](filterData, searchListVouchersService)
    .then((response) => {
        this.props['listReportFulfilledStatusAction'](response.value);
        this.tableData = response.value;
        this.setState(
          {
            tableData: this.tableData,
            filterTableData: this.tableData,
            countFilterTableData: this.tableData.length
          }
        );
    })
    .catch((error) => {
        console.log(error);
        this.props['listReportRejectedStatusAction'](filterData);
    })
    ;
  }

  /**
   * 
   * Generate Report button click
   */
  handleGenerateReportButtonClick(event)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::handleGenerateReportButtonClick");
    }

    let loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token,
      user_id: this.props['session'].session.user_id,
      page_number: this.state.page === 0 ? 1 : this.state.page,
      per_page: this.state.rowsPerPage,
    };

    this.props['listReportPendingStatusAction'](loginData);
    
    this.props['listReportAction'](loginData, searchListVouchersService)
    .then((response) => {
        this.props['listReportFulfilledStatusAction'](response.value);
        this.tableData = response.value;
        this.setState(
          {
            tableData: this.tableData,
            filterTableData: this.tableData,
            countFilterTableData: this.tableData.length
          }
        );
    })
    .catch((error) => {
        console.log(error);
        this.props['listReportRejectedStatusAction'](loginData);
    })
    ;

    this.setState(
      {
        searchTerm: ""
      }
    );

    let filteredReportData = null;
    if(this.searchTerm === ''){
      
      filteredReportData = this.state.tableData;
     
      this.setState({
        filterTableData: filteredReportData,
        countFilterTableData: filteredReportData ? filteredReportData.length : 0
      });
      
    }else{

      filteredReportData = this.state.tableData
      .filter( row => {
          return (row.username.toLowerCase() || '').indexOf(this.searchTerm.toLowerCase()) !== -1;
      });
     
      this.setState(
        { 
          filterTableData: filteredReportData,
          countFilterTableData: filteredReportData.length
        }
      );

    }
  }

  handleVisibleColumnsClick(event)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::handleVisibleColumnsClick");
    }

    this.setState({ anchorElVisibleColumns: event.currentTarget });
  }

  handleCloseVisibleColumnsMenu()
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::handleCloseVisibleColumnsMenu");
    }

    this.setState({ anchorElVisibleColumns: null });
  }

  handleResetColumnStatus()
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::handleResetColumnStatus");      
    }    
    this.setState(
      {
        hiddenColumns: {
          ...this.state.hiddenColumns,
          card_type: false,
          serial_number: false,
          amount: false,
          currency: false,
          refill_type: false,
          status: false,
          create_affiliate: false,
          create_date: false,
          affiliate_owner: false,
          player_used: false,
          date_of_use: false,
          member_id: false,
          username: false,
          refill_allowed: false,
          deactivated_after_spent: false,
          expiry_date: false,
          voucher_code: false
        }
      }
    );
  }

  handleTurnOnAllColumnStatus()
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::handleTurnOnAllColumnStatus");      
    }
    this.setState(
      {
        hiddenColumns: {
          ...this.state.hiddenColumns,
          card_type: false,
          serial_number: false,
          amount: false,
          currency: false,
          refill_type: false,
          status: false,
          create_affiliate: false,
          create_date: false,
          affiliate_owner: false,
          player_used: false,
          date_of_use: false,
          member_id: false,
          username: false,
          refill_allowed: false,
          deactivated_after_spent: false,
          expiry_date: false,
          voucher_code: false
        }
      }
    );
  }

  changeVisibleColumnStatus(event)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::changeVisibleColumnStatus");
      console.log(event.currentTarget.value);
    }
    
    const key = event.currentTarget.value;
   
    this.setState(
      {
        hiddenColumns: {
          ...this.state.hiddenColumns,
          [key]: !this.state.hiddenColumns[key]
        }
      }
    );

    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::changeVisibleColumnStatus");
      console.log(this.state.hiddenColumns);
    }
  }

  translateText(translateId)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::translateText");
    }
    return <FormattedMessage id={translateId} defaultMessage={translateId} />;
  }


  handleChangeTextField(evt)
  {
    let fieldName = evt.target.name;

    this.setState({
      filterFields: {
        ...this.state.filterFields,
        [fieldName]: evt.target.value
      }  
    });    
  }

  handleChangeAmountFilter(evt) 
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable :: handleChangeAmountFilter");
      console.log(evt.target.value);
    }

    let selAmount = JSON.parse(evt.target.value);

    this.setState({
        filterFields: {
          ...this.state.filterFields,
          amount: { value: selAmount.value, text: selAmount.text }
        }
      }
    );
  }

  handleChangeCreatedDateFilter(date)
  {
    this.setState({
      filterFields: {
        ...this.state.filterFields,
        created_date: date
      }
    });
  }

  handleChangeDateOfUseFilter(date)
  {
    this.setState({
      filterFields: {
        ...this.state.filterFields,
        date_of_use: date
      }
    });
  }

  handleChangeExpireBeforeFilter(date)
  {
    this.setState({
      filterFields: {
        ...this.state.filterFields,
        expire_before: date
      }
    });
  }

  handleChangeExpireAfterFilter(date)
  {
    this.setState({
      filterFields: {
        ...this.state.filterFields,
        expire_after: date
      }
    });
  }

  handleChangeCurrencyFilter(evt)
  {

    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable :: handleChangeCurrencyFilter");
      console.log(evt.target.value);
    }

    let selCurrency = JSON.parse(evt.target.value);
    if(DEBUG_CONSOLE){
      console.log(selCurrency);
    }

    this.setState({
      filterFields: {
        ...this.state.filterFields,
        currency: { ics: selCurrency.ics, id: selCurrency.id, description: selCurrency.description }
      }
    });
  }

  handleChangeStatusFilter(evt)
  {

    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable :: handleChangeStatusFilter");
      console.log(evt.target.value);
    }

    let selStatus = JSON.parse(evt.target.value);
    if(DEBUG_CONSOLE){
      console.log(selStatus);
    }

    this.setState({
      filterFields: {
        ...this.state.filterFields,
        status: { value: selStatus.value, text: selStatus.text }
      }
    });
  }

  handleChangeCreatedByFilter(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable :: handleChangeCreatedByFilter");
      console.log(evt.target.value);
    }

    let selCreatedBy = JSON.parse(evt.target.value);
    if(DEBUG_CONSOLE){
      console.log(selCreatedBy);
    }

    this.setState({
      filterFields: {
        ...this.state.filterFields,
        created_by: { affiliate_creator: selCreatedBy.affiliate_creator, creator_name: selCreatedBy.creator_name }
      }
    });
  }

  handleChangeAffiliateOwnerFilter(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable :: handleChangeAffiliateOwnerFilter");
      console.log(evt.target.value);
    }

    let selOwnedBy = JSON.parse(evt.target.value);
    if(DEBUG_CONSOLE){
      console.log(selOwnedBy);
    }

    this.setState({
      filterFields: {
        ...this.state.filterFields,
        affiliate_owner: { affiliate_owner: selOwnedBy.affiliate_owner, owner_name: selOwnedBy.owner_name }
      }
    });
  }

  handleChangeUsedByPlayerFilter(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable :: handleChangeUsedByPlayerFilter");
      console.log(evt.target.value);
    }

    let selUsedByPlayer = JSON.parse(evt.target.value);
    if(DEBUG_CONSOLE){
      console.log(selUsedByPlayer);
    }

    this.setState({
      filterFields: {
        ...this.state.filterFields,
        used_by_player: { used_by_player_id: selUsedByPlayer.used_by_player_id, player_used_by_name: selUsedByPlayer.player_used_by_name }
      }
    });
  }

  handleChangePromoCardFilter(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable :: handleChangePromoCardFilter");
      console.log(evt.target.value);
    }

    let selPromoCard = JSON.parse(evt.target.value);
    if(DEBUG_CONSOLE){
      console.log(selPromoCard);
    }

    this.setState({
      filterFields: {
        ...this.state.filterFields,
        promo_card: { value: selPromoCard.value, text: selPromoCard.text }
      }
    });
  }

  handleChangeRefillStatusFilter(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable :: handleChangeRefillStatusFilter");
      console.log(evt.target.value);
    }

    let selRefillStatus = JSON.parse(evt.target.value);
    if(DEBUG_CONSOLE){
      console.log(selRefillStatus);
    }

    this.setState({
      filterFields: {
        ...this.state.filterFields,
        refill_status: { value: selRefillStatus.value, text: selRefillStatus.text }
      }
    });
  }



  handleChangePage(event, newPage) {
    this.setState({
        page: newPage
      }
    );
  }

  handleChangeRowsPerPage(event) {
      this.setState({
        rowsPerPage: +event.target.value,
        page: 1
      }
    );    
  }

  renderTicketStatus(ticket_status){
    let intl = this.props['intl'];
    switch(ticket_status){
      case 'I':
        return <Status contentText={ intl.formatMessage( {id: 'Created'} ) } color="blue" />;
      case 'A':
        return <Status contentText={ intl.formatMessage( {id: 'Active'} ) }  color="green" />;
      case 'B':
        return <Status contentText={ intl.formatMessage( {id: 'Ban'} ) }  color="red" />;
      case 'U':
        return <Status contentText={ intl.formatMessage( {id: 'Used'} ) }  color="red" />;
      case 'E': 
        return <Status contentText={ intl.formatMessage( {id: 'Expired'} ) }  color="orange" />;  
      default: 
        return ticket_status;
    }
  }

  renderRefillAllowed(refill_allowed_status){
    let intl = this.props['intl'];
    switch(refill_allowed_status){
      case 'Y':
        return intl.formatMessage( {id: 'Yes'});
      case 'N':
          return intl.formatMessage( {id: 'No'});
      default: 
        return refill_allowed_status;
    }
  }

  renderDeactivatedAfterSpent(deactivated_after_spent_status){
    let intl = this.props['intl'];
    switch(deactivated_after_spent_status){
      case '1':
        return intl.formatMessage( {id: 'Yes'});
      case '-1':
          return intl.formatMessage( {id: 'No'});
      default: 
        return deactivated_after_spent_status;
    }
  }

  render() {
    if(DEBUG_CONSOLE){
      console.log("searchListVouchersTable::render");
      //console.log(event.currentTarget.value);
    }
    const intl = this.props['intl'];
    return (
      <div className={this.classes.tableResponsive}>
        <Grid container>
          <Grid item>
            <Typography variant="h6" style={{ padding: 10 }}>
              <SearchIcon />
              <FormattedMessage id="List / Search Vouchers" defaultMessage="List / Search Vouchers" />
            </Typography>
          </Grid>
        </Grid>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">
              {<FormattedMessage id="Filter Report" defaultMessage="Filter Report" />}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  name="serial_number"
                  label={<FormattedMessage id="Serial Number" defaultMessage="Serial Number" />}
                  fullWidth
                  value={this.state.filterFields.serial_number}
                  onChange = { (event) => this.handleChangeTextField(event) }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>
                  <InputLabel htmlFor="created_by">
                    <FormattedMessage id="Created By" defaultMessage="Created By" />
                  </InputLabel>  
                  <Select
                    value={ JSON.stringify(this.state.filterFields.created_by) }
                    onChange={this.handleChangeCreatedByFilter}
                    label={<FormattedMessage id="Created By" defaultMessage="Created By" />}
                    fullWidth
                    inputProps={{
                      name: 'created_by',
                      id: 'created_by',
                    }}
                  >
                    {
                      this.state.list_created_by_users.map((value, index) => {                        
                        return <MenuItem value={ JSON.stringify({affiliate_creator: value.affiliate_creator, creator_name: value.creator_name }) } 
                        key={index}>{value.creator_name}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <InlineDatePicker
                    keyboard
                    clearable 
                    margin="normal"
                    label={<FormattedMessage id="Date Of Use" defaultMessage="Date Of Use" />}
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}                      
                    value={ this.state.filterFields.date_of_use }
                    onChange={this.handleChangeDateOfUseFilter}
                    format="dd.MM.yyyy"
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>                  
                  <InputLabel htmlFor="promo_card">
                    <FormattedMessage id="Promo Card" defaultMessage="Promo Card" />
                  </InputLabel>  
                  <Select
                    value={ JSON.stringify(this.state.filterFields.promo_card) }
                    onChange={this.handleChangePromoCardFilter}
                    label={<FormattedMessage id="Promo Card" defaultMessage="Promo Card" />}
                    fullWidth
                    inputProps={{
                      name: 'promo_card',
                      id: 'promo_card',
                    }}
                  >                    
                    { 
                      this.state.list_promo_cards.map((value, index) => {                        
                        return <MenuItem value={ JSON.stringify({ value: value.value, text: value.text }) } 
                        key={index}>{value.text}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>                
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={this.classes.formControl}>
                    <InputLabel htmlFor="amount">
                      <FormattedMessage id="Amount" defaultMessage="Amount" />
                    </InputLabel>  
                    <Select
                      value={JSON.stringify(this.state.filterFields.amount)}
                      onChange={this.handleChangeAmountFilter}
                      label={<FormattedMessage id="Amount" defaultMessage="Amount" />}
                      fullWidth
                      inputProps={{
                        name: 'amount',
                        id: 'amount',
                      }}
                    >
                      { 
                        this.state.list_available_amounts.map((value, index) => {
                          //console.log("LIST AVAILABLE AMOUNTS >>> "); console.log(value);
                          //console.log(value);
                          return <MenuItem value={ JSON.stringify({ value: value.value, text: value.text }) } 
                          key={index}>{value.text}</MenuItem>
                        })
                      }
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <InlineDatePicker
                    keyboard
                    clearable 
                    margin="normal"
                    label={<FormattedMessage id="Created Date" defaultMessage="Created Date" />}
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}                      
                    value={ this.state.filterFields.created_date }
                    onChange={this.handleChangeCreatedDateFilter}
                    format="dd.MM.yyyy"
                  />
                </MuiPickersUtilsProvider>
              </Grid>        
              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>
                  <TextField
                    name="username"
                    label={<FormattedMessage id="Username" defaultMessage="Username" />}
                    fullWidth
                    value={this.state.filterFields.username}
                    onChange = { (event) => this.handleChangeTextField(event) }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>
                  <InputLabel htmlFor="refill_status">
                    <FormattedMessage id="Refill Status" defaultMessage="Refill Status" />
                  </InputLabel>  
                  <Select
                    value={ JSON.stringify(this.state.filterFields.refill_status) }
                    onChange={this.handleChangeRefillStatusFilter}
                    label={<FormattedMessage id="Refill Status" defaultMessage="Refill Status" />}
                    fullWidth
                    inputProps={{
                      name: 'refill_status',
                      id: 'refill_status',
                    }}
                  >
                    { 
                      this.state.list_refill_status.map((value, index) => {
                        return <MenuItem value={ JSON.stringify({ value: value.value, text: value.text }) } 
                        key={index}>{value.text}</MenuItem>
                      })
                    }                    
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>
                  <InputLabel htmlFor="currency">
                    <FormattedMessage id="Currency" defaultMessage="Currency" />
                  </InputLabel>  
                  <Select
                    value={JSON.stringify(this.state.filterFields.currency)}
                    onChange={this.handleChangeCurrencyFilter}
                    label={<FormattedMessage id="Currency" defaultMessage="Currency" />}
                    fullWidth
                    inputProps={{
                      name: 'currency',
                      id: 'currency',
                    }}
                  >
                    { 
                      this.state.list_available_currency.map((value, index) => {                        
                        return <MenuItem value={ JSON.stringify({ ics: value.ics, id: value.id, description: value.description }) } 
                        key={index}>{value.ics}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>                  
                  <InputLabel htmlFor="affiliate_owner">
                    <FormattedMessage id="Affiliate Owner" defaultMessage="Affiliate Owner" />
                  </InputLabel>  
                  <Select
                    value={ JSON.stringify(this.state.filterFields.affiliate_owner) }
                    onChange={this.handleChangeAffiliateOwnerFilter}
                    label={<FormattedMessage id="Affiliate Owner" defaultMessage="Affiliate Owner" />}
                    fullWidth
                    inputProps={{
                      name: 'affiliate_owner',
                      id: 'affiliate_owner',
                    }}
                  >
                    {
                      this.state.list_affiliate_owners.map((value, index) => {                        
                        return <MenuItem value={ JSON.stringify({affiliate_owner: value.affiliate_owner, owner_name: value.owner_name }) } 
                        key={index}>{value.owner_name}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <InlineDatePicker
                      keyboard
                      clearable 
                      margin="normal"
                      label={<FormattedMessage id="Expire Before" defaultMessage="Expire Before" />}
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}                      
                      value={ this.state.filterFields.expire_before }
                      onChange={this.handleChangeExpireBeforeFilter}
                      format="dd.MM.yyyy"
                    />
                  </MuiPickersUtilsProvider>                  
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>
                  &nbsp;
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>
                  <InputLabel htmlFor="status">
                    <FormattedMessage id="Status" defaultMessage="Status" />
                  </InputLabel>  
                  <Select
                    value={JSON.stringify(this.state.filterFields.status)}
                    onChange={this.handleChangeStatusFilter}
                    label={<FormattedMessage id="Status" defaultMessage="Status" />}
                    fullWidth
                    inputProps={{
                      name: 'status',
                      id: 'status',
                    }}
                  >
                    { 
                      this.state.list_available_statuses.map((value, index) => {                        
                        return <MenuItem value={ JSON.stringify({ value: value.value, text: value.text }) } 
                        key={index}>{value.text}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>
                  <InputLabel htmlFor="used_by_player">
                    <FormattedMessage id="Used By Player" defaultMessage="Used By Player" />
                  </InputLabel>  
                  <Select
                    value={ JSON.stringify(this.state.filterFields.used_by_player) }
                    onChange={this.handleChangeUsedByPlayerFilter}
                    label={<FormattedMessage id="Used By Player" defaultMessage="Used By Player" />}
                    fullWidth
                    inputProps={{
                      name: 'used_by_player',
                      id: 'used_by_player',
                    }}
                  >
                    {
                      this.state.list_used_by_player.map((value, index) => {                        
                        return <MenuItem value={ JSON.stringify({used_by_player_id: value.used_by_player_id, player_used_by_name: value.player_used_by_name }) } 
                        key={index}>{value.player_used_by_name}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl className={this.classes.formControl}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <InlineDatePicker
                      keyboard
                      clearable 
                      margin="normal"
                      label={<FormattedMessage id="Expire After" defaultMessage="Expire After" />}
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}                      
                      value={ this.state.filterFields.expire_after}
                      onChange={this.handleChangeExpireAfterFilter}
                      format="dd.MM.yyyy"
                    />
                  </MuiPickersUtilsProvider>                 
                </FormControl>
              </Grid>

            
              <Grid item xs={12} sm={6} md={3}>
                <Button type="button" color="primary" variant="contained" size="medium" 
                onClick={ (event) => this.handleFilterReportClick(event)}>
                  <FormattedMessage id="Filter" defaultMessage="Filter" />&nbsp;&nbsp;({ this.state.countFilterTableData})
                </Button>                
              </Grid>
            </Grid>  
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Grid container>
          
          <Grid container className={this.classes.filterSearchWrapper}>

            <Grid item className={this.classes.leftAlign}>
              <TextField placeholder={ intl.formatMessage( {id: 'Search'} ) }
                onChange={this.handleSearchFilter}
                onKeyDown={this.keyPressOnSearchField}
              />
              &nbsp;&nbsp;
              <Fab className={this.classes.iconButton} color="primary" size="small"
              aria-label={ intl.formatMessage( {id: 'Search'} ) } onClick={this.filterButtonClick}>
                  <SearchIcon />
              </Fab>
            </Grid>

            <Grid item className={this.classes.centerAlign}>             
              <Button className={this.classes.menuButton} color="default" aria-label="Menu" 
              onClick={this.handleVisibleColumnsClick}
              aria-owns={this.state.anchorElVisibleColumns ? 'simple-menu-select-columns' : undefined}
              aria-haspopup="true"
              >
                  <FilterListIcon />
                  <Hidden smDown>
                    <FormattedMessage id="Columns" defaultMessage="Columns" />
                  </Hidden>
              </Button>
              <Menu
                id="simple-menu-select-columns"
                anchorEl={this.state.anchorElVisibleColumns}
                open={Boolean(this.state.anchorElVisibleColumns)}
                onClose={this.handleCloseVisibleColumnsMenu}
              >
                <MenuItem>                  
                    <Button
                      value="reset"
                      onClick={this.handleResetColumnStatus}
                    >
                      <FormattedMessage id="Reset Columns" defaultMessage="Reset Columns" />
                    </Button>
                </MenuItem>
                <MenuItem>                  
                    <Button
                      value="reset"
                      onClick={this.handleTurnOnAllColumnStatus}
                    >
                    <FormattedMessage id="Turn On All Columns" defaultMessage="Turn On All Columns" />
                    </Button>
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="card_type"
                        checked={!this.state.hiddenColumns.card_type}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Card Type" defaultMessage="Card Type" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="serial_number"
                        checked={!this.state.hiddenColumns.serial_number}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Serial Number" defaultMessage="Serial Number" />}
                  />
                </MenuItem>
                <MenuItem>                
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="amount"
                        checked={!this.state.hiddenColumns.amount}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Amount" defaultMessage="Amount" />}
                  />
                </MenuItem>
                <MenuItem>                
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="currency"
                        checked={!this.state.hiddenColumns.currency}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Currency" defaultMessage="Currency" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="refill_type"
                        checked={!this.state.hiddenColumns.refill_type}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Refill Type" defaultMessage="Refill Type" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="status"
                        checked={!this.state.hiddenColumns.status}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Status" defaultMessage="Status" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="create_affiliate"
                        checked={!this.state.hiddenColumns.create_affiliate}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Create Affiliate" defaultMessage="Create Affiliate" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="create_date"
                        checked={!this.state.hiddenColumns.create_date}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Create Date" defaultMessage="Create Date" />}
                  />
                </MenuItem>               
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="affiliate_owner"
                        checked={!this.state.hiddenColumns.affiliate_owner}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Affiliate Owner" defaultMessage="Affiliate Owner" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="player_used"
                        checked={!this.state.hiddenColumns.player_used}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Player Used" defaultMessage="Player Used" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="date_of_use"
                        checked={!this.state.hiddenColumns.date_of_use}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Date Of Use" defaultMessage="Date Of Use" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="member_id"
                        checked={!this.state.hiddenColumns.member_id}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Member ID" defaultMessage="Member ID" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="username"
                        checked={!this.state.hiddenColumns.username}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Username" defaultMessage="Username" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="refill_allowed"
                        checked={!this.state.hiddenColumns.refill_allowed}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Refill Allowed" defaultMessage="Refill Allowed" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="deactivated_after_spent"
                        checked={!this.state.hiddenColumns.deactivated_after_spent}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Deactivated After Spent" defaultMessage="Deactivated After Spent" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="Expiry Date"
                        checked={!this.state.hiddenColumns.expiry_date}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Expiry Date" defaultMessage="Expiry Date" />}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        value="voucher_code"
                        checked={!this.state.hiddenColumns.voucher_code}
                        onChange={this.changeVisibleColumnStatus}
                      />
                    }
                    label={<FormattedMessage id="Voucher Code" defaultMessage="Voucher Code" />}
                  />
                </MenuItem>                
              </Menu>
            </Grid>

            <Grid item className={this.classes.rightAlign}>              
              <Button type="button" color="primary" variant="contained" size="large" 
              onClick={ (event) => this.handleGenerateReportButtonClick(event)}>
                <Hidden mdUp>
                  <SearchIcon /> 
                </Hidden>
                <Hidden smDown>
                  <FormattedMessage id="Generate Report" defaultMessage="Generate Report" />
                </Hidden>
              </Button>
            </Grid>
          </Grid>
        </Grid>  
        
        <Grid container>
          <Grid item xs={12}>  
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100, 200, 500, 1000]}
              component="div"
              count={this.state.countFilterTableData}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />          
          </Grid>
          <Grid item xs={12}>        
            <Table className={this.classes.table} aria-labelledby="Search / List Vouchers" size={'small'}>
              <TableHead>
                  <TableRow>

                    { !this.state.hiddenColumns.card_type &&
                    <TableCell component="th" scope="row" padding="none"
                    key={"th_card_type"}
                    sortDirection={this.orderBy === "card_type" ? this.state.order : false }                    
                    >                      
                      <TableSortLabel
                        active={this.state.orderBy === "card_type"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("card_type")}
                      >
                        <FormattedMessage id="Card Type" defaultMessage="Card Type" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.serial_number &&
                    <TableCell component="th" scope="row" padding="none"
                    key={"th_serial_number"}
                    sortDirection={this.orderBy === "serial_number" ? this.state.order : false }                    
                    >                      
                      <TableSortLabel
                        active={this.state.orderBy === "serial_number"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("serial_number")}
                      >
                        <FormattedMessage id="Serial Number" defaultMessage="Serial Number" />    
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.amount &&
                    <TableCell component="th" scope="row" padding="none" key={"th_amount"}>
                      <TableSortLabel
                        active={this.state.orderBy === "amount"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("amount")}
                      >
                        <FormattedMessage id="Amount" defaultMessage="Amount" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.subject_dtype &&
                    <TableCell component="th" scope="row" padding="none" key={"th_currency"}>
                      <TableSortLabel
                        active={this.state.orderBy === "currency"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("currency")}
                      >
                        <FormattedMessage id="Currency" defaultMessage="Currency" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.refill_type &&
                    <TableCell component="th" scope="row" padding="none" key={"th_refill_type"}>
                      <TableSortLabel
                        active={this.state.orderBy === "refill_type"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("refill_type")}
                      >
                        <FormattedMessage id="Refill Type" defaultMessage="Refill Type" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.status &&  
                    <TableCell component="th" scope="row" padding="none" key={"th_status"}>
                      <TableSortLabel
                        active={this.state.orderBy === "status"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("status")}
                      >
                        <FormattedMessage id="Status" defaultMessage="Status" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.create_affiliate &&  
                    <TableCell component="th" scope="row" padding="none" key={"th_create_affiliate"}>
                      <TableSortLabel
                        active={this.state.orderBy === "create_affiliate"}
                        direction={this.state.order}
                        onClick={this.createSortHandlerNumeric("create_affiliate")}
                      >
                        <FormattedMessage id="Create Affiliate" defaultMessage="Create Affiliate" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.create_date &&
                    <TableCell component="th" scope="row" padding="none" key={"th_create_date"}>
                      <TableSortLabel
                        active={this.state.orderBy === "create_date"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("create_date")}
                      >
                        <FormattedMessage id="Create Date" defaultMessage="Create Date" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.affiliate_owner &&
                    <TableCell component="th" scope="row" padding="none" key={"th_affiliate_owner"}>
                      <TableSortLabel
                        active={this.state.orderBy === "affiliate_owner"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("affiliate_owner")}
                      >
                        <FormattedMessage id="Affiliate Owner" defaultMessage="Affiliate Owner" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.player_used &&
                    <TableCell component="th" scope="row" padding="none" key={"th_player_used"}>
                      <TableSortLabel
                        active={this.state.orderBy === "player_used"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("player_used")}
                      >
                        <FormattedMessage id="Player Used" defaultMessage="Player Used" />
                      </TableSortLabel>
                    </TableCell>
                    }
                      
                    { !this.state.hiddenColumns.date_of_use &&
                    <TableCell component="th" scope="row" padding="none" key={"th_date_of_use"}>
                      <TableSortLabel
                        active={this.state.orderBy === "date_of_use"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("date_of_use")}
                      >
                        <FormattedMessage id="Date Of Use" defaultMessage="Date Of Use" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.member_id &&
                    <TableCell component="th" scope="row" padding="none" key={"th_member_id"}>
                      <TableSortLabel
                        active={this.state.orderBy === "member_id"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("member_id")}
                      >
                        <FormattedMessage id="Member ID" defaultMessage="Member ID" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.username &&
                    <TableCell component="th" scope="row" padding="none" key={"th_username"}>
                      <TableSortLabel
                        active={this.state.orderBy === "username"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("username")}
                      >
                        <FormattedMessage id="Username" defaultMessage="Username" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.refill_allowed &&
                    <TableCell component="th" scope="row" padding="none" key={"th_refill_allowed"}>
                      <TableSortLabel
                        active={this.state.orderBy === "refill_allowed"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("refill_allowed")}
                      >
                        <FormattedMessage id="Refill Allowed" defaultMessage="Refill Allowed" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.deactivated_after_spent &&
                    <TableCell component="th" scope="row" padding="none" key={"th_deactivated_after_spent"}>
                      <TableSortLabel
                        active={this.state.orderBy === "deactivated_after_spent"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("deactivated_after_spent")}
                      >
                        <FormattedMessage id="Deactivated After Spent" defaultMessage="Deactivated After Spent" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.expiry_date &&
                    <TableCell component="th" scope="row" padding="none" key={"th_expiry_date"}>
                      <TableSortLabel
                        active={this.state.orderBy === "expiry_date"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("expiry_date")}
                      >
                        <FormattedMessage id="Expiry Date" defaultMessage="Expiry Date" />
                      </TableSortLabel>
                    </TableCell>
                    }

                    { !this.state.hiddenColumns.voucher_code &&
                    <TableCell component="th" scope="row" padding="none" key={"th_voucher_code"}>
                      <TableSortLabel
                        active={this.state.orderBy === "voucher_code"}
                        direction={this.state.order}
                        onClick={this.createSortHandler("voucher_code")}
                      >
                        <FormattedMessage id="Voucher Code" defaultMessage="Voucher Code" />
                      </TableSortLabel>
                    </TableCell>
                    }
                    
                  </TableRow>
              </TableHead>    
              <TableBody>
                  { this.state.filterTableData && 
                  this.state.filterTableData
                  .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                  .map((row, index) => {
                    return (
                    <TableRow key={"row_" + index}>

                      { !this.state.hiddenColumns.card_type &&
                      <TableCell component="th" scope="row" padding="none" key={"card_type" + index}>
                        <div align="left">
                          <div>
                            { (row.username === null || row.username.length === 0) ? "Voucher" : "Member" }
                          </div>
                        </div>
                      </TableCell>
                      }  

                      { !this.state.hiddenColumns.serial_number &&
                      <TableCell component="th" scope="row" padding="none" key={"serial_number" + index}>
                        <div align="right">
                          <div>
                            { row.serial_number }
                          </div>
                        </div>
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.amount &&
                      <TableCell component="th" scope="row" padding="none" key={"amount" + index}>
                        <div align="right">
                          <div>{ NumberHelper.getFormattedDouble(row.amount) }</div>
                        </div>
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.currency &&  
                      <TableCell component="th" scope="row" padding="none" key={"currency" + index}>
                        <div align="center">
                          <div>{ row.currency }</div>
                        </div>                        
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.refill_type &&
                      <TableCell component="th" scope="row" padding="none" key={"refill_type" + index}>
                        { row.refill_type }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.status &&  
                      <TableCell component="th" scope="row" padding="none" key={"status" + index}>
                        {
                          <div>
                            {
                              this.renderTicketStatus(row.status)
                            }                            
                          </div>
                        }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.create_affiliate &&
                      <TableCell component="th" scope="row" padding="none" key={"create_affiliate" + index}>
                        { row.creator_name }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.create_date &&
                      <TableCell component="th" scope="row" padding="none" key={"create_date" + index}>
                        { row.creation_date }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.affiliate_owner &&
                      <TableCell component="th" scope="row" padding="none" key={"affiliate_owner" + index}>
                        { row.owner_name }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.player_used &&
                      <TableCell component="th" scope="row" padding="none" key={"player_used" + index}>
                        { row.player_name }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.date_of_use &&
                      <TableCell component="th" scope="row" padding="none" key={"date_of_use" + index}>
                        { row.used_date }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.member_id &&
                      <TableCell component="th" scope="row" padding="none" key={"member_id" + index}>
                        { row.player_name }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.username &&
                      <TableCell component="th" scope="row" padding="none" key={"username" + index}>
                        { row.username }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.refill_allowed &&
                      <TableCell component="th" scope="row" padding="none" key={"refill_allowed" + index}>
                        {
                          <div align="center">
                            {
                              this.renderRefillAllowed(row.refill_allowed)
                            }                            
                          </div>
                        }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.deactivated_after_spent &&
                      <TableCell component="th" scope="row" padding="none" key={"deactivated_after_spent" + index}>
                        {
                          <div align="center">
                            {
                              this.renderDeactivatedAfterSpent(row.deactivate_after_spent)
                            }                            
                          </div>
                        }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.expiry_date &&
                      <TableCell component="th" scope="row" padding="none" key={"expiry_date" + index}>
                        { row.expiry_date }
                      </TableCell>
                      }

                      { !this.state.hiddenColumns.voucher_code &&
                      <TableCell component="th" scope="row" padding="none" key={"voucher_code" + index}>
                        { row.prepaid_code }
                      </TableCell>
                      }

                    </TableRow>
                    );
                  })
                }
              </TableBody> 
            </Table>
          </Grid>
          <Grid item xs={12}>  
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100, 200, 500, 1000]}
              component="div"
              count={this.state.countFilterTableData}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />          
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const session = state.session;

  const report = state.report;
  const list_report_pending_status = state.list_report_pending_status;
  const list_report_fulfilled_status = state.list_report_fulfilled_status;
  const list_report_rejected_status = state.list_report_rejected_status;

  return { 
    session, 
    report, 
    list_report_pending_status, 
    list_report_fulfilled_status, 
    list_report_rejected_status 
  };
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({ 
    listReportAction, 
    listReportPendingStatusAction, 
    listReportFulfilledStatusAction, 
    listReportRejectedStatusAction
  }, dispatch)
);

const hoc = connect(mapStateToProps, mapDispatchToProps)(SearchListVouchersTable);

export default withStyles(SearchListVouchersTableStyle)(injectIntl(hoc));
