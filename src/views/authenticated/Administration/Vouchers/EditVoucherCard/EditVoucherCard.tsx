import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { FormattedMessage, injectIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EditVoucherCardStyle from "./EditVoucherCardStyle";
import classNames from 'classnames';
import { DEBUG_CONSOLE } from '../../../../../configuration/Config';
import { saveLoginAction } from '../../../../../redux/actions/session/SessionActions';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';
import { REST_SERVICE_BASE_URL } from "../../../../../configuration/Config";

import {
  listAvailableCurrencyService,
  listAffiliatesForCurrencyService,
  editVoucherCardService,
  listVouchersService
} 
  from "../../../../../redux/services/administration/vouchers/VouchersService"; 

import SearchIcon from '@material-ui/icons/Search';

import DateTimeHelper from '../../../../../helpers/DateTimeHelper';

class EditVoucherCard extends React.Component {

  classes = null;

  state = {
    start_serial_number: '',
    end_serial_number: '',
    currency: '',
    affiliate: { id: '', name: '' },
    number_of_days: { value: '', text: '' },
    expired_date: null,
    promo_card: { value: 'PROMO MONEY', text: 'Yes' },
    status_card: { value: 'N', text: 'No' },
    barcode_type: { value: 'C128', text: 'C128 (New)'},

    currency_disabled: true,
    affiliate_disabled: true,
    number_of_days_disabled: true,
    expired_date_disabled: true,
    promo_card_disabled: true,
    status_card_disabled: true,
    barcode_type_disabled: true,
    update_button_disabled: true,

    pdf_button_disabled: true,
    pdf_wide_button_disabled: true,
    excel_button_disabled: true,


    errorMessage: '',
    isErrorMessage: false,
    successMessage: '',
    isSuccessMessage: false,

    list_available_currency: [
      {
        ics: '',
        id: '',
        description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" />,
      }
    ],
    list_affiliates_for_currency: [
      {
        id: '',
        name: ''
      }
    ],
    list_number_of_days: [
      {
        value: '',
        text: ''        
      }
    ],
    list_promo_cards: [
      {
        value: 'REAL MONEY',
        text: 'No',        
      }
    ],
    list_status_cards: [
      
    ],
    list_barcode_types: [
      {
        value: 'C128',
        text: 'C128 (New)'
      }
    ]
  };

  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.object,
    saveLoginAction: PropTypes.func.isRequired
  }

  loginData = null;

  constructor(props, context)
  {
    super(props, context);

    this.classes = props.classes;
    
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);

    this.onUpdateButtonClick = this.onUpdateButtonClick.bind(this);
    this.onCancelButtonClick = this.onCancelButtonClick.bind(this);    

    this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
    this.handleChangeTextField = this.handleChangeTextField.bind(this);
    this.handleChangeNumber = this.handleChangeNumber.bind(this);
    this.handleChangeAffiliate = this.handleChangeAffiliate.bind(this);
    this.handleChangeNumberOfDays = this.handleChangeNumberOfDays.bind(this);
    this.handleChangeExpiredDate = this.handleChangeExpiredDate.bind(this);
    this.handleChangePromoCard = this.handleChangePromoCard.bind(this);
    this.handleChangeStatusCard = this.handleChangeStatusCard.bind(this);
    this.handleChangeBarcodeType = this.handleChangeBarcodeType.bind(this);
    
    this.handleGeneratePDFButtonClick = this.handleGeneratePDFButtonClick.bind(this);
    this.handleGeneratePDFWideButtonClick = this.handleGeneratePDFWideButtonClick.bind(this);
    this.handleGenerateExcelButtonClick = this. handleGenerateExcelButtonClick.bind(this);

    this.state = {
      currency: '',
      affiliate: { id: '', name: '' },
      number_of_days: { value: '', text: '' },
      expired_date: null,
      promo_card: { value: 'REAL MONEY', text: 'No' },
      status_card: { value: 'N', text: 'No' },
      barcode_type: { value: 'C128', text: 'C128 (New)' },

      currency_disabled: true,
      affiliate_disabled: true,
      number_of_days_disabled: true,
      expired_date_disabled: true,
      promo_card_disabled: true,
      status_card_disabled: true,
      barcode_type_disabled: true,
      
      update_button_disabled: true,

      pdf_button_disabled: true,
      pdf_wide_button_disabled: true,
      excel_button_disabled: true,
  
      errorMessage: '',
      isErrorMessage: false,
      successMessage: '',
      isSuccessMessage: false,

      start_serial_number: '',
      end_serial_number: '',
  
      list_available_currency: [
        {
          ics: '',
          id: '',
          description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" />,
        }
      ],
      list_affiliates_for_currency: [
        {
          id: '',
          name: ''
        }
      ],
      list_number_of_days: [
        {
          value: '',
          text: ''
        }
      ],
      list_promo_cards: [
        {
          value: 'REAL MONEY',
          text: 'No'
        }
      ],
      list_status_cards: [        
      ],
      list_barcode_types: [
        {
          value: 'C128',
          text: 'C128 (New)'
        }
      ],
    };
  }

  componentWillUnmount()
  {
  }

  componentDidMount()
  {
    this.loadData();
  }

  loadData()
  {
    if(DEBUG_CONSOLE){
      console.log("Vouchers \ Edit Voucher Card :: loadData");
      console.log(this.props['session']);
    }

    const loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token
    };


    this.setState({
      list_number_of_days: [
        {
          value: '', text: ''
        },
        {
          value: '30', text: '30'
        },
        {
          value: '60', text: '60'
        },
        {
          value: '90', text: '90'
        },
        {
          value: '180', text: '180'
        },
        {
          value: '360', text: '360'
        },
      ],
      list_promo_cards: [
        {
          value: "REAL MONEY",
          text: <FormattedMessage id="No" defaultMessage="No" />
        },
        {
          value: "PROMO MONEY",
          text: <FormattedMessage id="Yes" defaultMessage="Yes" />
        }
      ],
      list_status_cards: [     
        {
          value: "I",
          text: <FormattedMessage id="Create" defaultMessage="Create" />,
        },
        {
          value: "A",
          text: <FormattedMessage id="Active" defaultMessage="Active" />
        },
        {
          value: "B",
          text: <FormattedMessage id="Ban" defaultMessage="Ban" />
        },
      ],
      list_barcode_types: [
        {
          value: 'C39',
          text: 'C39 (Old)'
        },
        {
          value: 'C128',
          text: 'C128 (New)'
        },
      ],
    });
    
  }

  onSubmitButtonClick(evt){
    if(DEBUG_CONSOLE){
      console.log("Edit Voucher Card :: onSubmitButtonClick");
      //console.log(evt);
      console.log(this.state);
    }

    let searchVoucherCard = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token,
      start_serial_number: this.state.start_serial_number,
      end_serial_number: this.state.end_serial_number
    };

    listVouchersService(searchVoucherCard)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }

        //console.log(response.list_prepaid_cards[0]);
        searchVoucherCard['currency'] = response.list_prepaid_cards[0].currency;

        listAvailableCurrencyService(searchVoucherCard)
        .then((response2) => {
          if(response2.status === 'OK'){
            if(DEBUG_CONSOLE){
              console.log(response2);
            }

            for( let currency of response2.report ) {
              if(currency.ics == response.list_prepaid_cards[0].currency){
                searchVoucherCard['currency_id'] = currency.id;
              }
            }        
            
            this.setState({
              list_available_currency: [
                {
                  ics: '',
                  id: '',
                  description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" />
                },
                ...response2.report
              ]
            });

            if(DEBUG_CONSOLE){
              console.log("SearchListVouchersTable :: loadData >>  listAvailableCurrencyService");
              console.log(this.state.list_available_currency);
            }

            listAffiliatesForCurrencyService(searchVoucherCard)
            .then((response3) => {
              if(response3.status === 'OK'){
                if(DEBUG_CONSOLE){
                  console.log(response3);
                }

                let selected_affiliate = {};
                for( let affiliate of response3.report ) {
                  if(affiliate.id == response.list_prepaid_cards[0].affiliate_owner){
                    selected_affiliate = affiliate;
                  }
                }
                                
                this.setState({
                  list_affiliates_for_currency: [
                    {
                      id: '',
                      name: <FormattedMessage id="Select Affiliate" defaultMessage="Select Affiliate" />
                    },
                    ...response3.report
                  ],
                  affiliate: selected_affiliate,
                  update_button_disabled: false
                });

                if(DEBUG_CONSOLE){
                  console.log("SearchListVouchersTable :: loadData >>  listAffiliatesForCurrencyService");
                  console.log(this.state.list_affiliates_for_currency);
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });

          }
        })
        .catch((error) => {
          console.log(error);
        });

        
        const promo_card_value = response.list_prepaid_cards[0].refill_type == "PROMO MONEY" ?
          {
            value: "PROMO MONEY",
            text: <FormattedMessage id="Yes" defaultMessage="Yes" />
          }
          :
          {
            value: "REAL MONEY",
            text: <FormattedMessage id="No" defaultMessage="No" />
          }
        ;

        let status_card_value = {};
        if(response.list_prepaid_cards[0].status == "I"){
          status_card_value = 
          {
            value: "I",
            text: <FormattedMessage id="Create" defaultMessage="Create" />,
          };
        }else if(response.list_prepaid_cards[0].status == "A"){
          status_card_value = 
          {
            value: "A",
            text: <FormattedMessage id="Active" defaultMessage="Active" />,
          };
        }else if(response.list_prepaid_cards[0].status == "B"){
          status_card_value = 
          {
            value: "B",
            text: <FormattedMessage id="Ban" defaultMessage="Ban" />,
          };
        }
        
        this.setState(
          {
            currency: response.list_prepaid_cards[0].currency,
            affiliate: response.list_prepaid_cards[0].affiliate_owner,
            number_of_days: { value: '', text: '' },
            expired_date: response.list_prepaid_cards[0].expiry_date,
            promo_card: promo_card_value,
            status_card: status_card_value,
            barcode_type: { value: 'C128', text: 'C128 (New)' },

            currency_disabled: false,
            affiliate_disabled: false,
            number_of_days_disabled: false,
            expired_date_disabled: false,
            promo_card_disabled: false,
            status_card_disabled: false,
            barcode_type_disabled: false,

            pdf_button_disabled: false,
            pdf_wide_button_disabled: false,
            excel_button_disabled: false,
          }
        );
        
      }else{
       
      }
    })
    .catch((error) => {
      console.log(error);
    });

  }

  onUpdateButtonClick(evt){
    if(DEBUG_CONSOLE){
      console.log("Edit Voucher Card :: onUpdateButtonClick");
      //console.log(evt);
      console.log(this.state);
    }

    const number_of_days_obj = this.state.number_of_days;
    const number_of_days = number_of_days_obj['value'];

    let expire_date = (this.state.expired_date != "") ? DateTimeHelper.getFormattedDate(new Date(this.state.expired_date)) : "";
    if(expire_date == '01-Jan-1970'){
      expire_date = '';
    }

    const updateVoucherCard = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token,
      start_serial_number: this.state.start_serial_number,
      end_serial_number: this.state.end_serial_number,      
      promo: this.state.promo_card['value'],
      currency: this.state.currency,
      affiliate_id: this.state.affiliate['id'],
      expire_date: expire_date || '',
      no_of_days: number_of_days || '',
      status: this.state.status_card["value"]
    };
    
    editVoucherCardService(updateVoucherCard)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }        
        
        this.setState(
          {
            errorMessage: '',
            isErrorMessage: false,
            successMessage: this.props['intl'].formatMessage({ id:"Voucher card(s) successfully updated !", defaultMessage: "Voucher card(s) successfully updated !"}),
            isSuccessMessage: true,
          }
        );

        if(DEBUG_CONSOLE){
          console.log("SearchListVouchersTable :: loadData >>  listAffiliatesForCurrencyService");
          console.log(this.state.list_affiliates_for_currency);
        }
      }else{
        this.setState(
          {    
            errorMessage: response.error_messages,
            isErrorMessage: true,
            successMessage: '',
            isSuccessMessage: false,
          }
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
    
  }

  onCancelButtonClick(evt){
    if(DEBUG_CONSOLE){
      console.log("MyPersonalData :: onCancelButtonClick");
      //console.log(evt);
    }

    this.loadData();

    this.setState(
      {     
        currency: '',
        affiliate: { id: '', name: '' },
        number_of_days: { value: '', text: '' },
        expired_date: null,
        promo_card: { value: 'REAL MONEY', text: 'No' },
        status_card: { value: 'N', text: 'No' },
        barcode_type: { value: 'C128', text: 'C128 (New)' },

        currency_disabled: true,
        affiliate_disabled: true,
        number_of_days_disabled: true,
        expired_date_disabled: true,
        promo_card_disabled: true,
        activate_card_disabled: true,
        barcode_type_disabled: true,
        update_button_disabled: true,

        pdf_button_disabled: true,
        pdf_wide_button_disabled: true,
        excel_button_disabled: true,

        errorMessage: '',
        isErrorMessage: false,
        successMessage: '',
        isSuccessMessage: false,

        start_serial_number: '',
        end_serial_number: '',
      }
    );
  }

  handleInputFieldChange(fieldName, fieldValue)
  {
    this.setState({
      [fieldName]: fieldValue
    });
    //console.log(fieldName, fieldValue);
  }

  handleChangeTextField(evt)
  {
    let fieldName = evt.target.name;

    this.setState({
      [fieldName]: evt.target.value
    });    
  }

  handleChangeNumber(evt)
  {

    let fieldName = evt.target.name;

    let newValue = +evt.target.value;
   
    if(newValue < 0){
      newValue = 1;
    }

    this.setState({
      [fieldName]: newValue
    });   
  }

  handleChangeAffiliate(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateVoucherCard :: handleChangeAffiliate");
      console.log(event.target.value);
    }

    let selAffiliate = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selAffiliate);
    }

    if(selAffiliate.id != ""){
      this.setState({
        affiliate: { id: selAffiliate.id, name: selAffiliate.name },
        number_of_days_disabled: false,
        expired_date_disabled: false,

        promo_card_disabled: false,
        activate_card_disabled: false,
        barcode_type_disabled: false,
        deactivate_after_spent_disabled: false,
        update_button_disabled: false,
      });
    }else{
      this.setState({
        affiliate: { id: '', name: '' },
        number_of_days_disabled: true,
        expired_date_disabled: true,

        promo_card_disabled: true,
        activate_card_disabled: true,
        barcode_type_disabled: true,
        deactivate_after_spent_disabled: true,
        update_button_disabled: true,
      });
    }
  }

  handleChangeNumberOfDays(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateVoucherCard :: handleChangeNumberOfDays");
      console.log(event.target.value);
    }

    let selNumberOfDays = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selNumberOfDays);
    }

    if(selNumberOfDays.value != ""){
      this.setState({
        number_of_days: { value: selNumberOfDays.value, text: selNumberOfDays.text },
        expired_date: null
      });
    }
  }

  handleChangeExpiredDate(date)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateVoucherCard :: handleChangeExpiredDate");
      console.log(date);
    }

    if(date != null){
      this.setState({
        number_of_days: { value: '', text: '' },
        expired_date: date
      });
    }
  }

  handleChangePromoCard(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateVoucherCard :: handleChangePromoCard");
      console.log(event.target.value);
    }

    let selPromoCard = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selPromoCard);
    }

    if(selPromoCard.value != ""){
      this.setState({
        promo_card: { value: selPromoCard.value, text: selPromoCard.text },
      });
    }
  }

  handleChangeStatusCard(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateVoucherCard :: handleChangeStatusCard");
      console.log(event.target.value);
    }

    let selActivatedCard = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selActivatedCard);
    }

    if(selActivatedCard.value != ""){
      this.setState({
        status_card: { value: selActivatedCard.value, text: selActivatedCard.text },
      });
    }
  }

  handleChangeBarcodeType(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateVoucherCard :: handleChangeBarcodeType");
      console.log(event.target.value);
    }

    let selBarcodeType = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selBarcodeType);
    }

    if(selBarcodeType.value != ""){
      this.setState({
        barcode_type: { value: selBarcodeType.value, text: selBarcodeType.text },
      });
    }
  }

  handleGeneratePDFButtonClick(event)
  {

    const backoffice_session_id = this.props['session'].session.backoffice_session_id;
    const backoffice_username = this.props['session'].session.username;
    const serial_number_start = this.state.start_serial_number;
    const serial_number_end = this.state.end_serial_number;

    if(serial_number_start != '' && serial_number_end != ''){
      const url = REST_SERVICE_BASE_URL + '/administration/vouchers/pdf/pdf?backoffice_session_id=' + backoffice_session_id +
      '&backoffice_username=' + backoffice_username + '&serial_number_start=' + serial_number_start + '&serial_number_end=' + serial_number_end;
      window.open(url,'_blank');
    }
  }

  handleGeneratePDFWideButtonClick(event)
  {

    const backoffice_session_id = this.props['session'].session.backoffice_session_id;
    const backoffice_username = this.props['session'].session.username;
    const serial_number_start = this.state.start_serial_number;
    const serial_number_end = this.state.end_serial_number;

    if(serial_number_start != '' && serial_number_end != ''){
      const url = REST_SERVICE_BASE_URL + '/administration/vouchers/pdf/pdf-horizontal-layout?backoffice_session_id=' + backoffice_session_id +
      '&backoffice_username=' + backoffice_username + '&serial_number_start=' + serial_number_start + '&serial_number_end=' + serial_number_end;
      window.open(url,'_blank');
    }
  }

  handleGenerateExcelButtonClick(event)
  {

    const backoffice_session_id = this.props['session'].session.backoffice_session_id;
    const backoffice_username = this.props['session'].session.username;
    const serial_number_start = this.state.start_serial_number;
    const serial_number_end = this.state.end_serial_number;

    if(serial_number_start != '' && serial_number_end != ''){
      const url = REST_SERVICE_BASE_URL + '/administration/vouchers/excel/list-vouchers?backoffice_session_id=' + backoffice_session_id +
      '&backoffice_username=' + backoffice_username + '&serial_number_start=' + serial_number_start + '&serial_number_end=' + serial_number_end;
      window.open(url,'_blank');
    }
  }

  render() {
    return (
        <div className={this.props['classes']['content']}>            
            <Typography variant="h6" gutterBottom>              
              <EditIcon />
              <FormattedMessage id="Edit Voucher Card" defaultMessage="Edit Voucher Card" />
            </Typography>
            <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                  { 
                    this.state.isErrorMessage &&
                    <FormHelperText 
                    error={this.state.isErrorMessage} 
                    variant={'filled'}
                    className={classNames(this.props['classes']['errorMessage'])}
                    >
                      {this.state.errorMessage}
                    </FormHelperText>
                  }

                  { 
                    this.state.isSuccessMessage &&
                    <FormHelperText 
                    variant={'filled'}
                    className={classNames(this.props['classes']['successMessage'])}
                    >
                      {this.state.successMessage}
                    </FormHelperText>
                  }
                </Grid>

                <Grid item xs={6} sm={4}>
                  <InputLabel htmlFor="start_serial_number">
                    <FormattedMessage id="Start Serial Number" defaultMessage="Start Serial Number" />
                  </InputLabel>  
                  <TextField
                    type="number"
                    value={this.state.start_serial_number}
                    onChange={this.handleChangeNumber}
                    fullWidth
                    inputProps={{
                      name: 'start_serial_number',
                      id: 'start_serial_number',
                    }}
                  >
                  </TextField>
                </Grid>

                <Grid item xs={6} sm={4}>
                  <InputLabel htmlFor="end_serial_number">
                    <FormattedMessage id="End Serial Number" defaultMessage="End Serial Number" />
                  </InputLabel>  
                  <TextField
                    type="number"
                    value={this.state.end_serial_number}
                    onChange={this.handleChangeNumber}
                    fullWidth
                    inputProps={{
                      name: 'end_serial_number',
                      id: 'end_serial_number',
                    }}
                  >
                  </TextField>
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    size="medium"
                    color="primary"
                    className={this.props['classes']['submit']}
                    onClick={this.onSubmitButtonClick}
                  >
                    <SearchIcon />
                    <FormattedMessage id="Submit" defaultMessage="Submit" />
                  </Button>                
                </Grid>
            
                <Grid item xs={12} sm={12}>
                  <TextField
                        name="currency"
                        required
                        label={<FormattedMessage id="Currency" defaultMessage="Currency" />}
                        fullWidth
                        disabled={true}
                        value={this.state.currency}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputLabel htmlFor="affiliate">
                    <FormattedMessage id="Affiliate" defaultMessage="Affiliate" />
                  </InputLabel>  
                  <Select
                    value={JSON.stringify(this.state.affiliate)}
                    onChange={this.handleChangeAffiliate}
                    fullWidth
                    disabled={this.state.affiliate_disabled}
                    inputProps={{
                      name: 'affiliate',
                      id: 'affiliate',
                    }}
                  >
                    { 
                      this.state.list_affiliates_for_currency.map((value, index) => {
                        return <MenuItem value={ JSON.stringify({ id: value.id, name: value.name }) } 
                        key={index}>{value.name}</MenuItem>
                      })
                    }
                  </Select>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputLabel htmlFor="number_of_days">
                    <FormattedMessage id="Number Of Days" defaultMessage="Number Of Days" />
                  </InputLabel>  
                  <Select
                    value={JSON.stringify(this.state.number_of_days)}
                    onChange={this.handleChangeNumberOfDays}
                    fullWidth
                    disabled={this.state.number_of_days_disabled}
                    inputProps={{
                      name: 'number_of_days',
                      id: 'number_of_days',
                    }}
                  >
                    { 
                      this.state.list_number_of_days.map((value, index) => {
                        return <MenuItem value={ JSON.stringify({ value: value.value, text: value.text }) } 
                        key={index}>{value.text}</MenuItem>
                      })
                    }
                  </Select>                  
                </Grid>
                <Grid item xs={12} sm={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <InlineDatePicker
                      keyboard
                      clearable 
                      margin="normal"
                      label={<FormattedMessage id="Expired Date" defaultMessage="Expired Date" />}
                      fullWidth
                      disabled={this.state.expired_date_disabled}
                      InputLabelProps={{
                        shrink: true
                      }}                      
                      value={ this.state.expired_date }
                      onChange={this.handleChangeExpiredDate}
                      format="dd.MM.yyyy"
                    />
                  </MuiPickersUtilsProvider>                 
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputLabel htmlFor="promo_card">
                    <FormattedMessage id="Promo Card" defaultMessage="Promo Card" />
                  </InputLabel>  
                  <Select
                    value={ JSON.stringify(this.state.promo_card) }
                    onChange={this.handleChangePromoCard}
                    fullWidth
                    disabled={this.state.promo_card_disabled}
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
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputLabel htmlFor="status_card">
                    <FormattedMessage id="Status" defaultMessage="Status" />
                  </InputLabel>  
                  <Select
                    value={ JSON.stringify(this.state.status_card) }
                    onChange={this.handleChangeStatusCard}
                    fullWidth
                    disabled={this.state.status_card_disabled}
                    inputProps={{
                      name: 'status_card',
                      id: 'status_card',
                    }}
                  >
                    { 
                      this.state.list_status_cards.map((value, index) => {
                        return <MenuItem value={ JSON.stringify({ value: value.value, text: value.text }) } 
                        key={index}>{value.text}</MenuItem>
                      })
                    }
                  </Select>                  
                </Grid>                
                <Grid item xs={12} sm={12}>
                  <InputLabel htmlFor="barcode_type">
                    <FormattedMessage id="Barcode Type" defaultMessage="Barcode Type" />
                  </InputLabel>  
                  <Select
                    value={ JSON.stringify(this.state.barcode_type) }
                    onChange={this.handleChangeBarcodeType}
                    fullWidth
                    disabled={this.state.barcode_type_disabled}
                    inputProps={{
                      name: 'barcode_type',
                      id: 'barcode_type',
                    }}
                  >
                    { 
                      this.state.list_barcode_types.map((value, index) => {
                        return <MenuItem value={ JSON.stringify({ value: value.value, text: value.text }) } 
                        key={index}>{value.text}</MenuItem>
                      })
                    }
                  </Select>
                </Grid>
                            
                <Grid item xs={12} sm={6}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    size="medium"
                    color="primary"
                    disabled={this.state.update_button_disabled}
                    className={this.props['classes']['submit']}
                    onClick={this.onUpdateButtonClick}
                  >
                    <SaveIcon />
                    <FormattedMessage id="Update" defaultMessage="Update" />
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    size="medium"
                    color="default"
                    className={this.props['classes']['submit']}
                    onClick={this.onCancelButtonClick}
                  >
                    <CancelIcon />
                    <FormattedMessage id="Cancel" defaultMessage="Cancel" />
                  </Button>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    size="medium"
                    color="default"
                    className={this.props['classes']['submit']}
                    onClick={this.handleGeneratePDFButtonClick}
                    disabled={this.state.pdf_button_disabled}
                  >
                    <FormattedMessage id="PDF" defaultMessage="PDF" />
                  </Button>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    size="medium"
                    color="default"
                    className={this.props['classes']['submit']}
                    onClick={this.handleGeneratePDFWideButtonClick}
                    disabled={this.state.pdf_wide_button_disabled}
                  >
                    <FormattedMessage id="PDF Wide" defaultMessage="PDF Wide" />
                  </Button>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    size="medium"
                    color="default"
                    className={this.props['classes']['submit']}
                    onClick={this.handleGenerateExcelButtonClick}
                    disabled={this.state.excel_button_disabled}
                  >
                    <FormattedMessage id="Excel" defaultMessage="Excel" />
                  </Button>
                </Grid>

              </Grid>
        </div>
    );
  }
}

const mapStateToProps = state => {
  const session = state.session;

  return { 
    session
  };
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    saveLoginAction
  }, dispatch)
);

const hoc = connect(mapStateToProps, mapDispatchToProps)(EditVoucherCard);

export default withStyles(EditVoucherCardStyle)(injectIntl(hoc));