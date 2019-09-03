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
import CreateMemberCardStyle from "./CreateMemberCardStyle";
import classNames from 'classnames';
import { DEBUG_CONSOLE } from '../../../../../configuration/Config';
import { saveLoginAction } from '../../../../../redux/actions/session/SessionActions';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';
import { REST_SERVICE_BASE_URL } from "../../../../../configuration/Config";

import {
  listAvailableCurrencyService,
  listAffiliatesForCurrencyService,
  createMemberCardService
} 
  from "../../../../../redux/services/administration/vouchers/VouchersService"; 

class CreateMemberCard extends React.Component {

  classes = null;

  state = {
    number_of_cards: 1,
    amount_on_card: { value: '', text: '' },
    currency: { ics: '', id: '', description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" /> },
    affiliate: { id: '', name: '' },
    number_of_days: { value: '', text: '' },
    expired_date: null,
    username: '',
    password: { value: 'N', text: 'Numeric' },
    promo_card: { value: 'PROMO MONEY', text: 'Yes' },
    refill_card: { value: 'N', text: 'No' },
    activated_card: { value: 'N', text: 'No' },
    game_client_qr_code_url: { value: 'http://www.active200.com/html5test/lobby.html', text: 'WWW.ACTIVE200.COM - HTTP' },
    barcode_type: { value: 'C128', text: 'C128 (New)'},
    deactivate_after_spent: { value: '-1', text: 'No'},

    currency_disabled: true,
    affiliate_disabled: true,
    number_of_days_disabled: true,
    expired_date_disabled: true,
    username_disabled: true,
    password_disabled: true,
    promo_card_disabled: true,
    refill_card_disabled: true,
    activate_card_disabled: true,
    game_client_qr_code_url_disabled: true,
    barcode_type_disabled: true,
    deactivate_after_spent_disabled: true,

    create_button_disabled: true,

    errorMessage: '',
    isErrorMessage: false,
    successMessage: '',
    isSuccessMessage: false,

    start_serial_number: '',
    end_serial_number: '',

    list_amount_on_card: [
      {
        text: '',
        value: '',
      }
    ],
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
    list_activate_cards: [
      {
        value: 'N',
        text: 'No'        
      }
    ],
    list_barcode_types: [
      {
        value: 'C128',
        text: 'C128 (New)'
      }
    ],
    list_deactivate_spent: [
      {
        value: '-1',
        text: 'No'
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
    
    this.onCreateButtonClick = this.onCreateButtonClick.bind(this);
    this.onCancelButtonClick = this.onCancelButtonClick.bind(this);

    this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
    this.handleChangeTextField = this.handleChangeTextField.bind(this);
    this.handleChangeAmountOnCard = this.handleChangeAmountOnCard.bind(this);
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
    this.handleChangeAffiliate = this.handleChangeAffiliate.bind(this);
    this.handleChangeNumberOfDays = this.handleChangeNumberOfDays.bind(this);
    this.handleChangeExpiredDate = this.handleChangeExpiredDate.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangePromoCard = this.handleChangePromoCard.bind(this);
    this.handleChangeActivatedCard = this.handleChangeActivatedCard.bind(this);
    this.handleChangeRefillCard = this.handleChangeRefillCard.bind(this);
    this.handleChangeGameClientQRCodeUrl = this.handleChangeGameClientQRCodeUrl.bind(this);
    this.handleChangeBarcodeType = this.handleChangeBarcodeType.bind(this);
    this.handleChangeDeactivateAfterSpent = this.handleChangeDeactivateAfterSpent.bind(this);
    this.handleGeneratePDFButtonClick = this.handleGeneratePDFButtonClick.bind(this);
    this.handleGeneratePDFWideButtonClick = this.handleGeneratePDFWideButtonClick.bind(this);
    this.handleGenerateExcelButtonClick = this. handleGenerateExcelButtonClick.bind(this);

    this.handleGenerateQRPDFWideButtonClick = this.handleGenerateQRPDFWideButtonClick.bind(this);
    this.handleGenerateQRPDFButtonClick = this.handleGenerateQRPDFButtonClick.bind(this);

    this.state = {
      number_of_cards: 1,
      amount_on_card: { value: '', text: '' },
      currency: { ics: '', id: '', description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" /> },
      affiliate: { id: '', name: '' },
      number_of_days: { value: '', text: '' },
      expired_date: null,
      username: '',
      password: { value: 'N', text: 'Numeric' },
      promo_card: { value: 'REAL MONEY', text: 'No' },
      refill_card: { value: 'N', text: 'No' },
      activated_card: { value: 'N', text: 'No' },
      game_client_qr_code_url: { value: 'http://www.active200.com/html5test/lobby.html', text: 'WWW.ACTIVE200.COM - HTTP' },
      barcode_type: { value: 'C128', text: 'C128 (New)' },
      deactivate_after_spent: { value: '-1', text: 'No' },

      currency_disabled: true,
      affiliate_disabled: true,
      number_of_days_disabled: true,
      expired_date_disabled: true,
      username_disabled: true,
      password_disabled: true,
      promo_card_disabled: true,
      refill_card_disabled: true,
      activate_card_disabled: true,
      game_client_qr_code_url_disabled: true,
      barcode_type_disabled: true,
      deactivate_after_spent_disabled: true,
      create_button_disabled: true,
  
      errorMessage: '',
      isErrorMessage: false,
      successMessage: '',
      isSuccessMessage: false,

      start_serial_number: '',
      end_serial_number: '',
  
      list_amount_on_card: [
        {
          value: '',
          text: ''
        }
      ],
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
      list_activate_cards: [
        {
          value: 'N',
          text: 'No'
        }
      ],
      list_barcode_types: [
        {
          value: 'C128',
          text: 'C128 (New)'
        }
      ],
      list_deactivate_spent: [
        {
          value: '-1',
          text: 'No'
        }
      ]
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
      console.log("Vouchers \ Create Member Card :: loadData");
      console.log(this.props['session']);
    }

    const loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token
    };


    this.setState({
      list_amount_on_card: [
        {
          value: "", text: ""
        },        
        {
          value: '5', text: '5'
        },
        {
          value: '10', text: '10'
        },
        {
          value: '20', text: '20'
        },
        {
          value: '50', text: '50'
        },
        {
          value: '100', text: '100'
        },
        {
          value: '200', text: '200'
        },
        {
          value: '500', text: '500'
        },
        {
          value: '1000', text: '1000'
        },
        {
          value: '2000', text: '2000'
        },
        {
          value: '5000', text: '5000'
        },
        {
          value: '10000', text: '10000'
        }
      ],
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
      list_activate_cards: [     
        {
          value: "N",
          text: <FormattedMessage id="No" defaultMessage="No" />,
        },
        {
          value: "Y",
          text: <FormattedMessage id="Yes" defaultMessage="Yes" />
        }
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
      list_deactivate_spent: [
        {
          value: '-1',
          text: <FormattedMessage id="No" defaultMessage="No" />,
        },
        {
          value: '1',
          text: <FormattedMessage id="Yes" defaultMessage="Yes" />
        }
      ]
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
    
  }

  onCreateButtonClick(evt){
    if(DEBUG_CONSOLE){
      console.log("Create Member Card :: onCreateButtonClick");
      //console.log(evt);
      console.log(this.state);
    }

    const newMemberCard = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token,
      no_cards: this.state.number_of_cards,
      amount: this.state.amount_on_card['value'],
      promo: this.state.promo_card['value'],
      currency: this.state.currency['ics'],
      affiliate_id: this.state.affiliate['id'],
      expire_date: this.state.expired_date,
      no_of_days: this.state.number_of_days['value'],
      activate: this.state.activated_card['value'],
      member_card: 'Y',
      username: this.state.username,
      pass: this.state.password['value'],
      refill_allowed: this.state.refill_card['value'],
      deactivate_after_spent: this.state.deactivate_after_spent['value'],
    };

    //console.log(newMemberCard);
    
    createMemberCardService(newMemberCard)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }

        const serialNumberStart = response.serial_number_start;
        const serialNumberEnd = response.serial_number_end;

        const successText = "SN Start: " + serialNumberStart + " SN End: " + serialNumberEnd;
        
        this.setState(
          {
            number_of_cards: 1,
            amount_on_card: { value: '', text: '' },
            currency: { ics: '', id: '', description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" /> },
            affiliate: { id: '', name: '' },
            number_of_days: { value: '', text: '' },
            expired_date: null,
            username: '',
            password: { value: 'N', text: 'Numeric' },
            promo_card: { value: 'REAL MONEY', text: 'No' },
            refill_card: { value: 'N', text: 'No' },
            activated_card: { value: 'N', text: 'No' },
            game_client_qr_code_url: { value: 'http://www.active200.com/html5test/lobby.html', text: 'WWW.ACTIVE200.COM - HTTP' },
            barcode_type: { value: 'C128', text: 'C128 (New)' },
            deactivate_after_spent: { value: '-1', text: 'No' },
    
            currency_disabled: true,
            affiliate_disabled: true,
            number_of_days_disabled: true,
            expired_date_disabled: true,
            username_disabled: true,
            password_disabled: true,
            promo_card_disabled: true,
            refill_card_disabled: true,
            activate_card_disabled: true,
            game_client_qr_code_url_disabled: true,
            barcode_type_disabled: true,
            deactivate_after_spent_disabled: true,
            create_button_disabled: true,
    
            errorMessage: '',
            isErrorMessage: false,
            successMessage: ( this.props['intl'].formatMessage({ id:"Member card successfully created !", defaultMessage: "Member card successfully created !"}) + "  " + successText),
            isSuccessMessage: true,

            start_serial_number: response.serial_number_start,
            end_serial_number: response.serial_number_end,
          }
        );

        if(DEBUG_CONSOLE){
          console.log("SearchListVouchersTable :: loadData >>  listAffiliatesForCurrencyService");
          console.log(this.state.list_affiliates_for_currency);
        }
      }else{
        this.setState(
          {
            number_of_cards: 1,
            amount_on_card: { value: '', text: '' },
            currency: { ics: '', id: '', description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" /> },
            affiliate: { id: '', name: '' },
            number_of_days: { value: '', text: '' },
            expired_date: null,
            username: '',
            password: { value: 'N', text: 'Numeric' },
            promo_card: { value: 'REAL MONEY', text: 'No' },
            refill_card: { value: 'N', text: 'No' },
            activated_card: { value: 'N', text: 'No' },
            game_client_qr_code_url: { value: 'http://www.active200.com/html5test/lobby.html', text: 'WWW.ACTIVE200.COM - HTTP' },
            barcode_type: { value: 'C128', text: 'C128 (New)' },
            deactivate_after_spent: { value: '-1', text: 'No' },
    
            currency_disabled: true,
            affiliate_disabled: true,
            number_of_days_disabled: true,
            expired_date_disabled: true,
            promo_card_disabled: true,
            refill_card_disabled: true,
            activate_card_disabled: true,
            barcode_type_disabled: true,
            game_client_qr_code_url_disabled: true,
            deactivate_after_spent_disabled: true,
            create_button_disabled: true,
    
            errorMessage: <FormattedMessage id="Member card not created !" defaultMessage="Member card not created !" />,
            isErrorMessage: true,
            successMessage: '',
            isSuccessMessage: false,

            start_serial_number: '',
            end_serial_number: '',
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
      console.log("Create Member Card :: onCancelButtonClick");
      //console.log(evt);
    }

    this.loadData();

    this.setState(
      {
        number_of_cards: 1,
        amount_on_card: JSON.stringify({ value: '', text: '' }),
        currency: JSON.stringify({ ics: '', id: '', description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" /> }),
        affiliate: JSON.stringify({ value: '', text: '' }),
        number_of_days: JSON.stringify({ value: '', text: '' }),
        expired_date: null,
        username: '',
        password: JSON.stringify({ value: 'N', text: 'Numeric' }),
        promo_card: JSON.stringify({ value: 'REAL MONEY', text: 'No' }),
        activated_card: JSON.stringify({ value: 'N', text: 'No' }),
        game_client_qr_code_url: JSON.stringify({ value: 'http://www.active200.com/html5test/lobby.html', text: 'WWW.ACTIVE200.COM - HTTP' }),
        barcode_type: JSON.stringify({ value: 'C128', text: 'C128 (New)' }),
        deactivate_after_spent: JSON.stringify({ value: '-1', text: 'No' }),

        currency_disabled: true,
        affiliate_disabled: true,
        number_of_days_disabled: true,
        expired_date_disabled: true,
        username_disabled: true,
        password_disabled: true,
        promo_card_disabled: true,
        refill_card_disabled: true,
        activate_card_disabled: true,
        game_client_qr_code_url_disabled: true,
        barcode_type_disabled: true,
        deactivate_after_spent_disabled: true,
        create_button_disabled: true,

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

  handleChangeNumberOfCards(evt)
  {

    let fieldName = evt.target.name;

    let newValue = +evt.target.value;
    if(newValue > 1000)
    {
      newValue = 1000;
    }
    if(newValue < 0){
      newValue = 1;
    }

    this.setState({
      [fieldName]: newValue
    });   
  }

  handleChangeAmountOnCard(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangeAmountOnCard");
      console.log(event.target.value);
    }

    let selAmount = JSON.parse(event.target.value);

    if(selAmount.value != ""){
      this.setState({
          amount_on_card: { value: selAmount.value, text: selAmount.text },
          currency_disabled: false,
          create_button_disabled: true,
        }
      );
    }else{
      this.setState({
          amount_on_card: { value: "", text: "" },
          currency_disabled: true,
          create_button_disabled: true,
          currency: JSON.stringify({ ics: '', id: '', description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" /> }),
        }
      );
    }
  }

  handleChangeCurrency(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangeCurrency");
      console.log(event.target.value);
    }

    let selCurrency = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selCurrency);
    }

    if(selCurrency.id != ""){
      this.setState({
        currency: { ics: selCurrency.ics, id: selCurrency.id, description: selCurrency.description },
        affiliate_disabled: false,
        create_button_disabled: true,
      });

      const loginData = {
        backoffice_session_id: this.props['session'].session.backoffice_session_id,
        currency_id: selCurrency.id,
        affiliate_id: this.props['session'].session.affiliate_id
      };

      listAffiliatesForCurrencyService(loginData)
      .then((response) => {
        if(response.status === 'OK'){
          if(DEBUG_CONSOLE){
            console.log(response);
          }
          
          this.setState({
            list_affiliates_for_currency: [
              {
                id: '',
                name: <FormattedMessage id="Select Affiliate" defaultMessage="Select Affiliate" />
              },
              ...response.report
            ]
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
    }else{
      this.setState({
        currency: { ics: '', id: '', description: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" /> },
        affiliate_disabled: true,
        create_button_disabled: true,
      });
    }
  }

  handleChangeAffiliate(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangeAffiliate");
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
        username_disabled: false,
        password_disabled: false,

        promo_card_disabled: false,
        refill_card_disabled: false,
        activate_card_disabled: false,
        game_client_qr_code_url_disabled: false,
        barcode_type_disabled: false,
        deactivate_after_spent_disabled: false,
        create_button_disabled: false,
      });
    }else{
      this.setState({
        affiliate: { id: '', name: '' },
        number_of_days_disabled: true,
        expired_date_disabled: true,
        username_disabled: true,
        password_disabled: true,

        promo_card_disabled: true,
        refill_card_disabled: true,
        activate_card_disabled: true,
        game_client_qr_code_url_disabled: true,
        barcode_type_disabled: true,
        deactivate_after_spent_disabled: true,
        create_button_disabled: true,
      });
    }
  }

  handleChangeNumberOfDays(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangeNumberOfDays");
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
      console.log("CreateMemberCard :: handleChangeExpiredDate");
      console.log(date);
    }

    if(date != null){
      this.setState({    
        number_of_days: { value: '', text: '' },
        expired_date: date
      });
    }
  }

  handleChangePassword(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangePassword");
      console.log(event.target.value);
    }

    let selPassword = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selPassword);
    }

    if(selPassword.value != ""){
      this.setState({
        password: { value: selPassword.value, text: selPassword.text },
      });
    }
  }

  handleChangePromoCard(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangePromoCard");
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

  handleChangeRefillCard(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangeRefillCard");
      console.log(event.target.value);
    }

    let selRefill = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selRefill);
    }

    if(selRefill.value != ""){
      this.setState({
        refill_card: { value: selRefill.value, text: selRefill.text },
      });
    }
  }

  handleChangeActivatedCard(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangeActivatedCard");
      console.log(event.target.value);
    }

    let selActivatedCard = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selActivatedCard);
    }

    if(selActivatedCard.value != ""){
      this.setState({
        activated_card: { value: selActivatedCard.value, text: selActivatedCard.text },
      });
    }
  }

  handleChangeGameClientQRCodeUrl(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangeGameClientQRCodeUrl");
      console.log(event.target.value);
    }

    let selGameClientUrl = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selGameClientUrl);
    }

    if(selGameClientUrl.value != ""){
      this.setState({
        game_client_qr_code_url: { value: selGameClientUrl.value, text: selGameClientUrl.text },
      });
    }
  }

  handleChangeBarcodeType(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangeBarcodeType");
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

  handleChangeDeactivateAfterSpent(event)
  {
    if(DEBUG_CONSOLE){
      console.log("CreateMemberCard :: handleChangeDeactivateAfterSpent");
      console.log(event.target.value);
    }

    let selDeactivateAfterSpent = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selDeactivateAfterSpent);
    }

    if(selDeactivateAfterSpent.value != ""){
      this.setState({
        deactivate_after_spent: { value: selDeactivateAfterSpent.value, text: selDeactivateAfterSpent.text },
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
      const url = REST_SERVICE_BASE_URL + '/administration/member/pdf/pdf?backoffice_session_id=' + backoffice_session_id +
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
      const url = REST_SERVICE_BASE_URL + '/administration/member/pdf/pdf-horizontal-layout?backoffice_session_id=' + backoffice_session_id +
      '&backoffice_username=' + backoffice_username + '&serial_number_start=' + serial_number_start + '&serial_number_end=' + serial_number_end;
      window.open(url,'_blank');
    }
  }

  handleGenerateQRPDFButtonClick(event)
  {

    const backoffice_session_id = this.props['session'].session.backoffice_session_id;
    const backoffice_username = this.props['session'].session.username;
    const serial_number_start = this.state.start_serial_number;
    const serial_number_end = this.state.end_serial_number;
    const qr_code_url = this.state.game_client_qr_code_url['value'];

    if(serial_number_start != '' && serial_number_end != ''){
      const url = REST_SERVICE_BASE_URL + '/administration/member/pdf/qr-pdf?backoffice_session_id=' + backoffice_session_id +
      '&backoffice_username=' + backoffice_username + '&serial_number_start=' + serial_number_start + '&serial_number_end=' + serial_number_end + "&qr_code_url=" + qr_code_url;
      window.open(url,'_blank');
    }
  }

  handleGenerateQRPDFWideButtonClick(event)
  {

    const backoffice_session_id = this.props['session'].session.backoffice_session_id;
    const backoffice_username = this.props['session'].session.username;
    const serial_number_start = this.state.start_serial_number;
    const serial_number_end = this.state.end_serial_number;
    const qr_code_url = this.state.game_client_qr_code_url['value'];

    if(serial_number_start != '' && serial_number_end != ''){
      const url = REST_SERVICE_BASE_URL + '/administration/member/pdf/qr-pdf-wide?backoffice_session_id=' + backoffice_session_id +
      '&backoffice_username=' + backoffice_username + '&serial_number_start=' + serial_number_start + '&serial_number_end=' + serial_number_end + "&qr_code_url=" + qr_code_url;
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
      const url = REST_SERVICE_BASE_URL + '/administration/member/excel/list-member-cards?backoffice_session_id=' + backoffice_session_id +
      '&backoffice_username=' + backoffice_username + '&serial_number_start=' + serial_number_start + '&serial_number_end=' + serial_number_end;
      window.open(url,'_blank');
    }
  }

  render() {
    return (
        <div className={this.props['classes']['content']}>            
            <Typography variant="h6" gutterBottom>              
              <AddIcon />
              <FormattedMessage id="Create Member Card" defaultMessage="Create Member Card" />
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
                <Grid item xs={12} sm={12}>
                  <TextField
                      name="number_of_cards"
                      type="number"
                      required
                      label={<FormattedMessage id="Number Of Cards" defaultMessage="Number Of Cards" />}
                      fullWidth
                      value={this.state.number_of_cards}
                      onChange = { (event) => this.handleChangeNumberOfCards(event) }
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <InputLabel htmlFor="amount_on_card">
                      <FormattedMessage id="Amount On Card" defaultMessage="Amount On Card" />
                    </InputLabel>  
                    <Select                    
                      value={JSON.stringify(this.state.amount_on_card)}
                      onChange={this.handleChangeAmountOnCard}
                      fullWidth
                      inputProps={{
                        name: 'amount_on_card',
                        id: 'amount_on_card',
                      }}
                    >
                      { 
                        this.state.list_amount_on_card.map((value, index) => {
                          return <MenuItem value={ JSON.stringify({ value: value.value, text: value.text }) } 
                          key={index}>{value.text}</MenuItem>
                        })
                      }
                    </Select>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputLabel htmlFor="currency">
                    <FormattedMessage id="Currency" defaultMessage="Currency" />
                  </InputLabel>  
                  <Select
                    value={JSON.stringify(this.state.currency)}
                    onChange={this.handleChangeCurrency}
                    fullWidth
                    disabled={this.state.currency_disabled}
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
                  <TextField
                      name="username"
                      required
                      label={<FormattedMessage id="Username" defaultMessage="Username" />}
                      fullWidth
                      disabled={this.state.username_disabled}
                      value={this.state.username}
                      onChange = { (event) => this.handleChangeTextField(event) }
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputLabel htmlFor="password">
                    <FormattedMessage id="Password" defaultMessage="Password" />
                  </InputLabel>
                  <Select
                    value={JSON.stringify(this.state.password)}
                    onChange={this.handleChangePassword}
                    fullWidth
                    disabled={this.state.password_disabled}
                    inputProps={{
                      name: 'password',
                      id: 'password',
                    }}
                  >
                    <MenuItem value={JSON.stringify({value: 'N', text: 'Numeric'})}>
                      <FormattedMessage id="Numeric" defaultMessage="Numeric" />
                    </MenuItem>
                    <MenuItem value={JSON.stringify({value: 'C', text: 'Character'})}>
                      <FormattedMessage id="Character" defaultMessage="Character" />
                    </MenuItem>
                    <MenuItem value={JSON.stringify({value: 'M', text: 'Mixed'})}>
                      <FormattedMessage id="Mixed" defaultMessage="Mixed" />
                    </MenuItem>
                  </Select>
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
                  <InputLabel htmlFor="refill_card">
                    <FormattedMessage id="Refill" defaultMessage="Refill" />
                  </InputLabel>
                  <Select
                    value={JSON.stringify(this.state.refill_card)}
                    onChange={this.handleChangeRefillCard}
                    fullWidth
                    disabled={this.state.refill_card_disabled}
                    inputProps={{
                      name: 'refill_card',
                      id: 'refill_card',
                    }}
                  >
                    <MenuItem value={JSON.stringify({value: 'N', text: 'No'})}>
                      <FormattedMessage id="No" defaultMessage="No" />
                    </MenuItem>
                    <MenuItem value={JSON.stringify({value: 'Y', text: 'Yes'})}>
                      <FormattedMessage id="Yes" defaultMessage="Yes" />
                    </MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputLabel htmlFor="activated_card">
                    <FormattedMessage id="Activate" defaultMessage="Activate" />
                  </InputLabel>  
                  <Select
                    value={ JSON.stringify(this.state.activated_card) }
                    onChange={this.handleChangeActivatedCard}
                    //label={<FormattedMessage id="Promo Card" defaultMessage="Promo Card" />}
                    fullWidth
                    disabled={this.state.activate_card_disabled}
                    inputProps={{
                      name: 'activated_card',
                      id: 'activated_card',
                    }}
                  >
                    { 
                      this.state.list_activate_cards.map((value, index) => {
                        return <MenuItem value={ JSON.stringify({ value: value.value, text: value.text }) } 
                        key={index}>{value.text}</MenuItem>
                      })
                    }
                  </Select>                  
                </Grid>

                <Grid item xs={12} sm={12}>
                  <InputLabel htmlFor="game_client_qr_code_url">
                    <FormattedMessage id="GC URL for QR" defaultMessage="GC URL for QR" />
                  </InputLabel>
                  <Select
                    value={JSON.stringify(this.state.game_client_qr_code_url)}
                    onChange={this.handleChangeGameClientQRCodeUrl}
                    fullWidth
                    disabled={this.state.game_client_qr_code_url_disabled}
                    inputProps={{
                      name: 'game_client_qr_code_url',
                      id: 'game_client_qr_code_url',
                    }}
                  >
                    <MenuItem value={JSON.stringify({value: 'http://www.active200.com/html5test/lobby.html', text: 'WWW.ACTIVE200.COM - HTTP'})}>
                      WWW.ACTIVE200.COM - HTTP
                    </MenuItem>
                    <MenuItem value={JSON.stringify({value: 'https://www.active200.com/html5test/lobby.html', text: 'WWW.ACTIVE200.COM - HTTPS'})}>
                      WWW.ACTIVE200.COM - HTTPS
                    </MenuItem>
                    <MenuItem value={JSON.stringify({value: 'https://www.club200.com/m/lobby.html', text: 'WWW.CLUB200.COM'})}>
                      WWW.CLUB200.COM
                    </MenuItem>
                    <MenuItem value={JSON.stringify({value: 'https://www.multigame7.com/m/lobby.html', text: 'WWW.MULTIGAME7.COM'})}>
                      WWW.MULTIGAME7.COM
                    </MenuItem>
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
                <Grid item xs={12} sm={12}>
                  <InputLabel htmlFor="deactivate_after_spent">
                    <FormattedMessage id="Deactivate After Spent" defaultMessage="Deactivate After Spent" />
                  </InputLabel>  
                  <Select
                    value={ JSON.stringify(this.state.deactivate_after_spent) }
                    onChange={this.handleChangeDeactivateAfterSpent}
                    fullWidth
                    disabled={this.state.deactivate_after_spent_disabled}
                    inputProps={{
                      name: 'deactivate_after_spent',
                      id: 'deactivate_after_spent',
                    }}
                  >
                    { 
                      this.state.list_deactivate_spent.map((value, index) => {
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
                    className={this.props['classes']['submit']}
                    onClick={this.onCreateButtonClick}
                    disabled={this.state.create_button_disabled}
                  >
                    <SaveIcon />
                    <FormattedMessage id="Create" defaultMessage="Create" />
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
                    disabled={!this.state.isSuccessMessage}
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
                    disabled={!this.state.isSuccessMessage}
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
                    disabled={!this.state.isSuccessMessage}
                  >
                    <FormattedMessage id="Excel" defaultMessage="Excel" />
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
                    onClick={this.handleGenerateQRPDFButtonClick}
                    disabled={!this.state.isSuccessMessage}
                  >
                    <FormattedMessage id="QR PDF" defaultMessage="QR PDF" />
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
                    onClick={this.handleGenerateQRPDFWideButtonClick}
                    disabled={!this.state.isSuccessMessage}
                  >
                    <FormattedMessage id="QR PDF Wide" defaultMessage="QR PDF Wide" />
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

const hoc = connect(mapStateToProps, mapDispatchToProps)(CreateMemberCard);

export default withStyles(CreateMemberCardStyle)(injectIntl(hoc));