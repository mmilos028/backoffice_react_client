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
import NewUserStyle from "./NewUserStyle";
import classNames from 'classnames';
import { DEBUG_CONSOLE } from '../../../../../configuration/Config';
import { saveLoginAction } from '../../../../../redux/actions/session/SessionActions';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';
import { REST_SERVICE_BASE_URL } from "../../../../../configuration/Config";

import { listCountriesService } 
from '../../../../../redux/services/my_account/MyPersonalDataService';

import {
  listAllRolesService,
  listAffiliatesForNewUserService
} 
  from "../../../../../redux/services/administration/users_and_administrators/UsersAndAdministratorsService"; 

class NewUserForm extends React.Component {

  classes = null;

  state = {
    select_role: { id: '', name: <FormattedMessage id="Select Role" defaultMessage="Select Role" /> },
    username: '',
    password: '',
    confirm_password: '',

    select_hardware_key: null,
    select_terminal_type: null,
    select_exit_button: null,
    select_enter_only_password: null,

    email: '',
    first_name: '',
    last_name: '',

    backoffice_logout_inactivity: 30,
    terminal_logout_inactivity: 10,
    player_desktop_inactivity: 9,
    player_mobile_inactivity: 9,

    select_new_login_kill_existing: null,
    service_code: '',
    confirm_service_code: '',
    
    select_affiliate: { affiliate_id: '', affiliate_name: <FormattedMessage id="Select Affiliate" defaultMessage="Select Affiliate" /> },
    birthday: null,
    phone_number: '',
    address: '',
    zip: '',
    city: '',
    select_country: { country_code: '', country_name: <FormattedMessage id="Select Country" defaultMessage="Select Country" /> },
    //select_country: { country_code: this.props['session'].session.affiliate_last_login_detail[0].country_id, country_name: this.props['session'].session.affiliate_last_login_detail[0].country_name },
    auto_increment: '',
    select_multi_currency: { value: 'N', text: <FormattedMessage id="No" defaultMessage="No" /> },

    select_one_cashbox: null,

    select_currency: { currency_id: '', currency_name: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" /> },

    ///hidden fields status

    select_role__visible: true,
    username__visible: true,
    password__visible: true,
    confirm_password__visible: true,

    select_hardware_key__visible: false,
    select_terminal_type__visible: false,
    select_exit_button__visible: false,
    select_enter_only_password__visible: false,

    email__visible: true,
    first_name__visible: true,
    last_name__visible: true,

    backoffice_logout_inactivity__visible: false,
    terminal_logout_inactivity__visible: false,
    player_desktop_inactivity__visible: false,
    player_mobile_inactivity__visible: false,
    select_new_login_kill_existing__visible: false,
    service_code__visible: false,
    confirm_service_code__visible: false,    
    select_affiliate__visible: false,
    birthday__visible: true,
    phone_number__visible: true,
    address__visible: true,
    zip__visible: true,
    city__visible: true,
    select_country__visible: true,
    auto_increment__visible: false,
    select_multi_currency__visible: false,
    select_one_cashbox__visible: false,
    select_currency__visible: true,

    save_button_disabled: true,

    errorMessage: '',
    isErrorMessage: false,
    successMessage: '',
    isSuccessMessage: false,



    list_roles: [
      {
        id: '',
        name: <FormattedMessage id="Select Role" defaultMessage="Select Role" />
      }
    ],
    list_countries: [
      {
        country_code: '',
        country_name: <FormattedMessage id="Select Country" defaultMessage="Select Country" />
      }
    ],
    list_affiliates: [
      {
        affiliate_id: '',
        affiliate_name: <FormattedMessage id="Select Affiliate" defaultMessage="Select Affiliate" />
      }
    ],
    list_currency: [
      {
        currency_id: '',
        currency_name: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" />
      }
    ],
    list_multi_currency: [
      {
        value: 'N',
        text: <FormattedMessage id="No" defaultMessage="No" />
      },
      {
        value: 'Y',
        text: <FormattedMessage id="Yes" defaultMessage="Yes" />
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
  

    this.handleChangeSelectRole = this.handleChangeSelectRole.bind(this);

    this.handleChangeSelectAffiliate = this.handleChangeSelectAffiliate.bind(this);

    this.handleChangeBirthday = this.handleChangeBirthday.bind(this);

    this.handleChangeCountry = this.handleChangeCountry.bind(this);

    this.handleChangeSelectMulticurrency = this.handleChangeSelectMulticurrency.bind(this);

    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);

    this.onCancelButtonClick = this.onCancelButtonClick.bind(this);
    
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
      console.log("UsersAndAdministrators / NewUserForm :: loadData");
      console.log(this.props['session']);
    }

    const loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token
    };

    listAllRolesService(loginData)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }        
        
        this.setState({
          list_roles: [
            { id: '', name: <FormattedMessage id="Select Role" defaultMessage="Select Role" /> },
            ...response.report
          ]
        });
        
      }
    })
    .catch((error) => {
      console.log(error);
    });

    listCountriesService(loginData)
    .then((response) => {
      if(response.status == 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }
        this.setState(
          {
            list_countries: [
              { country_code: '', country_name: <FormattedMessage id="Select Country" defaultMessage="Select Country" /> },
              ...response.report
            ],
            select_country: { country_code: this.props['session'].session.affiliate_last_login_detail[0].country_id, country_name: this.props['session'].session.affiliate_last_login_detail[0].country_name },
          }
        );
      }
    })
    .catch((error) => {      
      console.log(error);        
    });

    listAffiliatesForNewUserService(loginData)
    .then((response) => {
      if(response.status == 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }
        this.setState(
          {
            list_affiliates: [
              { affiliate_id: '', affiliate_name: <FormattedMessage id="Select Affiliate" defaultMessage="Select Affiliate" /> },
              ...response.report
            ]
          }
        );
      }
    })
    .catch((error) => {      
      console.log(error);        
    });
    
  }

  onSaveButtonClick(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("UsersAndAdministrators / NewUserForm :: onSaveButtonClick");
      //console.log(evt);
      console.log(this.state);
    }

    const newUserInformation = {
      
    };

    //console.log(newMemberCard);
    
    /*
    createMemberCardService(newMemberCard)
    .then((response) => {
      if(response.status === 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }

      }else{
        
      }
    })
    .catch((error) => {
      console.log(error);
    });
    */
  }

  onCancelButtonClick(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("UsersAndAdministrators :: NewUserForm :: onCancelButtonClick");
      //console.log(evt);
    }

    this.loadData();

    this.setState(
      {
        select_role: { id: '', name: <FormattedMessage id="Select Role" defaultMessage="Select Role" /> },
        username: '',
        password: '',
        confirm_password: '',

        select_hardware_key: null,
        select_terminal_type: null,
        select_exit_button: null,
        select_enter_only_password: null,

        email: '',
        first_name: '',
        last_name: '',

        backoffice_logout_inactivity: 30,
        terminal_logout_inactivity: 10,
        player_desktop_inactivity: 9,
        player_mobile_inactivity: 9,

        select_new_login_kill_existing: null,
        service_code: '',
        confirm_service_code: '',
        
        select_affiliate: null,
        birthday: null,
        phone_number: '',
        address: '',
        zip: '',
        city: '',
        select_country: { country_code: this.props['session'].session.affiliate_last_login_detail[0].country_id, country_name: this.props['session'].session.affiliate_last_login_detail[0].country_name },
        select_multi_currency: null,

        select_one_cashbox: null,

        select_currency: { currency_id: '', currency_name: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" /> },

        ///hidden fields status

        select_role__visible: true,
        username__visible: true,
        password__visible: true,
        confirm_password__visible: true,

        select_hardware_key__visible: false,
        select_terminal_type__visible: false,
        select_exit_button__visible: false,
        select_enter_only_password__visible: false,

        email__visible: true,
        first_name__visible: true,
        last_name__visible: true,

        backoffice_logout_inactivity__visible: false,
        terminal_logout_inactivity__visible: false,
        player_desktop_inactivity__visible: false,
        player_mobile_inactivity__visible: false,
        select_new_login_kill_existing__visible: false,
        service_code__visible: false,
        confirm_service_code__visible: false,    
        select_affiliate__visible: false,
        birthday__visible: true,
        phone_number__visible: true,
        address__visible: true,
        zip__visible: true,
        city__visible: true,
        select_country__visible: true,
        select_multi_currency__visible: false,
        select_one_cashbox__visible: false,
        select_currency__visible: true,

        save_button_disabled: true,

        errorMessage: '',
        isErrorMessage: false,
        successMessage: '',
        isSuccessMessage: false,
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

  handleChangeSelectRole(event)
  {
    if(DEBUG_CONSOLE){
      console.log("UsersAndAdministrators :: NewUserForm :: handleChangeSelectRole");
      console.log(event.target.value);
    }

    let selRole = JSON.parse(event.target.value);

    if(selRole.id != ""){
      this.setState({
          select_role: { id: selRole.id, name: selRole.name }
        }
      );

      if(selRole.name == 'Ad / Administrator')
      {
        this.setState(
          {
            select_affiliate__visible: true,
            select_multi_currency__visible: true
          }
        )
      }
      else if(selRole.name == 'Ad / Cashier' || selRole.name == 'Ad / Cashier Payout' || selRole.name == 'Ad / Cashier SubLevel' ||
      selRole.name == 'Ad / Cashier Thai' || selRole.name == 'Ad / Collector' || selRole.name == 'Ad / Reverse Administrator' ||
      selRole.name == 'Ad / ShiftCashierS' || selRole.name == 'Ad / ShiftCashierW' || selRole.name == 'Admin-Custom' || 
      selRole.name == 'Admin-Custom-Mini')
      {
        this.setState(
          {
            select_affiliate: { affiliate_id: '', affiliate_name: <FormattedMessage id="Select Affiliate" defaultMessage="Select Affiliate" /> },
            select_affiliate__visible: true,
            select_multi_currency: { text: 'N', value: <FormattedMessage id="No" defaultMessage="No" /> },
            select_multi_currency__visible: false,
          }
        );
      }
      else if(selRole.name == 'Af / Affiliate' || selRole.name == 'Aff / Location' || selRole.name == 'Aff / Location Payout' || 
      selRole.name == 'Aff / Operater' || selRole.name == 'Aff / Panic' 
      )
      {

      }
      else if(selRole.name == 'Pl / PC player - Internet' || selRole.name == 'Pl / Terminal player')
      {

      }
      else
      {
        this.setState(
          {
            select_affiliate__visible: false,
            select_multi_currency__visible: false,
          }
        );
      }
    }else{
      this.setState(
        {
          select_role: { id: '', name: <FormattedMessage id="Select Role" defaultMessage="Select Role" /> },
          select_affiliate: { affiliate_id: '', affiliate_name: <FormattedMessage id="Select Affiliate" defaultMessage="Select Affiliate" /> },
          select_affiliate__visible: false,
          select_multi_currency: { text: 'N', value: <FormattedMessage id="No" defaultMessage="No" /> },
          select_multi_currency__visible: false,
        }    
      );
    }
  }

  handleChangeCurrency(event)
  {
    if(DEBUG_CONSOLE){
      console.log("UsersAndAdministrators :: NewUserForm :: handleChangeCurrency");
      console.log(event.target.value);
    }

    let selCurrency = JSON.parse(event.target.value);
    if(DEBUG_CONSOLE){
      console.log(selCurrency);
    }

    if(selCurrency.currency_id != ""){
      this.setState({
        currency: { currency_id: selCurrency.currency_id, currency_name: selCurrency.currency_name },
        affiliate_disabled: false,
        create_button_disabled: true,
      });
      
    }else{
      this.setState({
        currency: { currency_id: '', currency_name: <FormattedMessage id="Select Currency" defaultMessage="Select Currency" /> },
        affiliate_disabled: true,
        create_button_disabled: true,
      });
    }
  }

  handleChangeSelectAffiliate(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("UsersAndAdministrators :: NewUserForm :: handleChangeSelectAffiliate");
      console.log(evt);
    }

    let selAffiliate = JSON.parse(evt.target.value);

    this.setState({        
        select_affiliate: { affiliate_id: selAffiliate.affiliate_id, affiliate_name: selAffiliate.affiliate_name }
      }
    );
  }

  handleChangeBirthday(date)
  {
    if(DEBUG_CONSOLE){
      console.log("UsersAndAdministrators :: NewUserForm :: handleChangeBirthday");
      console.log(date);
    }

    if(date != null){
      this.setState({    
        birthday: date
      });
    }
  }

  handleChangeCountry(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("UsersAndAdministrators :: NewUserForm :: handleChangeCountry");
      console.log(evt);
    }

    let selCountry = JSON.parse(evt.target.value);
    //console.log(selCountry);

    this.setState({
        country_code: selCountry.country_code, 
        country_name: selCountry.country_name,
        select_country: { country_code: selCountry.country_code, country_name: selCountry.country_name }
      }
    );
  }

  handleChangeSelectMulticurrency(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("UsersAndAdministrators :: NewUserForm :: handleChangeSelectMulticurrency");
      console.log(evt);
    }

    let selMulticurrency = JSON.parse(evt.target.value);

    this.setState({        
        select_multi_currency: { value: selMulticurrency.value, text: selMulticurrency.text }
      }
    );
  }

  render() {
    return (
        <div className={this.props['classes']['content']}>            
            <Typography variant="h6" gutterBottom>              
              <AddIcon />
              <FormattedMessage id="New User" defaultMessage="New User" />
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
                <Grid item xs={12} sm={6}>
                  { this.state.select_role__visible &&
                    <Grid item xs={12} sm={12}>
                        <InputLabel htmlFor="select_role" required>
                          <FormattedMessage id="Select Role" defaultMessage="Select Role" />
                        </InputLabel>  
                        <Select                    
                          value={JSON.stringify(this.state.select_role)}
                          onChange={this.handleChangeSelectRole}
                          fullWidth                      
                          inputProps={{
                            name: 'select_role',
                            id: 'select_role',
                          }}
                        >
                          { 
                            this.state.list_roles.map((value, index) => {
                              return <MenuItem value={ JSON.stringify({ id: value.id, name: value.name }) } 
                              key={index}>{value.name}</MenuItem>
                            })
                          }
                        </Select>
                    </Grid>
                  }

                  {
                    this.state.username__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="username"
                          type="text"
                          required
                          label={<FormattedMessage id="Username" defaultMessage="Username" />}
                          fullWidth
                          value={this.state.username}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }

                  {
                    this.state.password__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="password"
                          type="password"
                          required
                          label={<FormattedMessage id="Password" defaultMessage="Password" />}
                          fullWidth
                          value={this.state.password}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }

                  {
                    this.state.confirm_password__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="confirm_password"
                          type="password"
                          required
                          label={<FormattedMessage id="Confirm Password" defaultMessage="Confirm Password" />}
                          fullWidth
                          value={this.state.confirm_password}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }

                  {
                    this.state.email__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="email"
                          type="text"
                          label={<FormattedMessage id="Email" defaultMessage="Email" />}
                          fullWidth
                          value={this.state.email}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }

                  {
                    this.state.first_name__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="first_name"
                          type="text"
                          label={<FormattedMessage id="First Name" defaultMessage="First Name" />}
                          fullWidth
                          value={this.state.first_name}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }

                  {
                    this.state.last_name__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="last_name"
                          type="text"
                          label={<FormattedMessage id="Last Name" defaultMessage="Last Name" />}
                          fullWidth
                          value={this.state.last_name}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }
              
                </Grid>

                <Grid item xs={12} sm={6}>

                  { 
                    this.state.select_affiliate__visible &&
                    <Grid item xs={12} sm={12}>
                        <InputLabel htmlFor="select_affiliate" required>
                          <FormattedMessage id="Select Affiliate" defaultMessage="Select Affiliate" />
                        </InputLabel>  
                        <Select                    
                          value={JSON.stringify(this.state.select_affiliate)}
                          onChange={this.handleChangeSelectAffiliate}
                          fullWidth
                          required
                          inputProps={{
                            name: 'select_affiliate',
                            id: 'select_affiliate',
                          }}
                        >
                          { 
                            this.state.list_affiliates.map((value, index) => {
                              return <MenuItem value={ JSON.stringify({ affiliate_id: value.affiliate_id, affiliate_name: value.affiliate_name }) } 
                              key={index}>{value.affiliate_name}</MenuItem>
                            })
                          }
                        </Select>
                    </Grid>
                  }

                  { this.state.birthday__visible &&
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <InlineDatePicker
                        keyboard
                        clearable 
                        margin="normal"
                        label={<FormattedMessage id="Birthday" defaultMessage="Birthday" />}
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}                      
                        value={ this.state.birthday }
                        onChange={this.handleChangeBirthday}
                        format="dd-MMM-yyyy"
                      />
                  </MuiPickersUtilsProvider>  
                  }

                  {
                    this.state.phone_number__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="phone_number"
                          type="text"
                          label={<FormattedMessage id="Phone Number" defaultMessage="Phone Number" />}
                          fullWidth
                          value={this.state.phone_number}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }

                  {
                    this.state.address__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="address"
                          type="text"
                          label={<FormattedMessage id="Address" defaultMessage="Address" />}
                          fullWidth
                          value={this.state.address}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }

                  {
                    this.state.zip__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="zip"
                          type="text"
                          label={<FormattedMessage id="Zip" defaultMessage="Zip" />}
                          fullWidth
                          value={this.state.zip}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }

                  {
                    this.state.city__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="city"
                          type="text"
                          label={<FormattedMessage id="City" defaultMessage="City" />}
                          fullWidth
                          value={this.state.city}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }

                  {
                    this.state.select_country__visible &&  
                    <Grid item xs={12} sm={12}>                 
                      <InputLabel htmlFor="country" required>
                        <FormattedMessage id="Country" defaultMessage="Country" />
                      </InputLabel>
                      <Select
                        value={ JSON.stringify(this.state.select_country) }
                        onChange={this.handleChangeCountry}
                        fullWidth
                        required
                        inputProps={{
                          name: 'country',
                          id: 'country',
                        }}
                      >
                        { 
                          this.state.list_countries.map((value, index) => {
                            return <MenuItem value={ JSON.stringify({ country_code: value.country_code, country_name: value.country_name }) } key={index}>{value.country_name}</MenuItem>
                          })
                        }
                      </Select>
                    </Grid>
                  }

                  {
                    this.state.select_multi_currency__visible &&  
                    <Grid item xs={12} sm={12}>                 
                      <InputLabel htmlFor="multi_currency">
                        <FormattedMessage id="Multicurrency" defaultMessage="Multicurrency" />
                      </InputLabel>
                      <Select
                        value={ JSON.stringify(this.state.select_multi_currency) }
                        onChange={this.handleChangeSelectMulticurrency}
                        fullWidth
                        required
                        inputProps={{
                          name: 'multi_currency',
                          id: 'multi_currency',
                        }}
                      >
                        { 
                          this.state.list_multi_currency.map((value, index) => {
                            return <MenuItem value={ JSON.stringify({ value: value.value, text: value.text }) } key={index}>
                            {value.text}
                            </MenuItem>
                          })
                        }
                      </Select>
                    </Grid>
                  }


                  {
                    this.state.select_currency__visible &&  
                    <Grid item xs={12} sm={12}>                 
                      <InputLabel htmlFor="currency" required>
                        <FormattedMessage id="Currency" defaultMessage="Currency" />
                      </InputLabel>
                      <Select
                        value={ JSON.stringify(this.state.select_currency) }
                        onChange={this.handleChangeCurrency}
                        fullWidth
                        required
                        inputProps={{
                          name: 'currency',
                          id: 'currency',
                        }}
                      >
                        { 
                          this.state.list_currency.map((value, index) => {
                            return <MenuItem value={ JSON.stringify({ currency_id: value.currency_id, currency_name: value.currency_name }) } key={index}>{value.currency_name}</MenuItem>
                          })
                        }
                      </Select>
                    </Grid>
                  }

                  {
                    this.state.auto_increment__visible &&
                    <Grid item xs={12} sm={12}>
                      <TextField
                          name="auto_increment"
                          type="text"
                          label={<FormattedMessage id="Autoincrement Value" defaultMessage="Autoincrement Value" />}
                          fullWidth
                          value={this.state.auto_increment}
                          onChange = { (event) => this.handleChangeTextField(event) }
                      />
                    </Grid>
                  }

                </Grid>

              </Grid>

              <Grid container>

                <Grid item xs={12} sm={3} className={classNames(this.classes.rightFormButtonsAlign)}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    size="medium"
                    color="primary"
                    className={this.props['classes']['submit']}
                    onClick={this.onSaveButtonClick}
                    disabled={this.state.save_button_disabled}
                  >
                    <SaveIcon />
                    <FormattedMessage id="Save" defaultMessage="Save" />
                  </Button>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    size="medium"
                    color="default"
                    className={this.props['classes']['cancel']}
                    onClick={this.onCancelButtonClick}
                  >
                    <CancelIcon />
                    <FormattedMessage id="Cancel" defaultMessage="Cancel" />
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

const hoc = connect(mapStateToProps, mapDispatchToProps)(NewUserForm);

export default withStyles(NewUserStyle)(injectIntl(hoc));