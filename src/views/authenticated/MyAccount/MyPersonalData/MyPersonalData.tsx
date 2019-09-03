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
import PersonIcon from '@material-ui/icons/Person';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MyPersonalDataStyle from "./MyPersonalDataStyle";
import classNames from 'classnames';
import { DEBUG_CONSOLE } from '../../../../configuration/Config';
import { personalInformationService, listCountriesService, updatePersonalInformationService } 
from '../../../../redux/services/my_account/MyPersonalDataService';
import { saveLoginAction } from '../../../../redux/actions/session/SessionActions';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';

class MyPersonalData extends React.Component {

  state = {
    username: '',
    mobile_phone: '',
    first_name: '',
    last_name: '',
    birthday: null,
    email: '',
    address: '',
    post_code: '',
    city: '',
    country_code: '',
    country_name: '',
    language: '',
    currency: '',
    list_countries: Array(),
    user_id: '',
    account_active: '',
    subject_type_name: '',
    subject_type_id: '',
    selected_country: { country_code: '', country_name: '' },
    path: '',

    create_button_disabled: true,

    errorMessage: '',
    isErrorMessage: false,
    successMessage: '',
    isSuccessMessage: false
  };

  static propTypes = {
    classes: PropTypes.object,
    session: PropTypes.object,
    saveLoginAction: PropTypes.func.isRequired
  }

  constructor(props, context)
  {
    super(props, context);

    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.onCancelButtonClick = this.onCancelButtonClick.bind(this);
    this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
    this.handleChangeBirthday = this.handleChangeBirthday.bind(this);
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
      console.log("My Account \ My Personal Data :: loadData");
      console.log(this.props['session']);
    }

    const loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token,
      affiliate_id: this.props['session'].session.affiliate_id
    };

    listCountriesService(loginData)
    .then((response) => {
      if(response.status == 'OK'){
        if(DEBUG_CONSOLE){
          console.log(response);
        }
        this.setState(
          {
            list_countries: response.report
          }
        );

        personalInformationService(loginData)
        .then((response) => {
          if(response.status == 'OK'){
            if(DEBUG_CONSOLE){
              console.log(response);
            }
            this.setState(
              {
                username: response.user.username || '',
                mobile_phone: response.user.phone || '',
                first_name: response.user.first_name || '',
                last_name: response.user.last_name || '',
                birthday: response.user.birthday || null,
                email: response.user.email || '',
                address: response.user.address || '',
                post_code: response.user.zip_code || '',
                city: response.user.city || '',
                country_code: response.user.country_code || '',
                country_name: response.user.country_name || '',
                selected_country: { country_code: response.user.country_code || '', country_name: response.user.country_name || '' },
                language: response.user.language || 'en_GB',
                currency: response.user.currency || '',
                path: response.user.path,

                create_button_disabled: false
              }
            );
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
  }

  handleChangeLanguage(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("MyPersonalData :: handleChangeLanguage");
      console.log(evt.target.value);
    }
    this.setState({ language: evt.target.value });
    this.props['session']['session']['language'] = evt.target.value;
    this.props['saveLoginAction'](this.props['session']['session']);
  }

  handleChangeCountry(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("MyPersonalData :: handleChangeCountry");
      console.log(evt);
    }

    let selCountry = JSON.parse(evt.target.value);
    //console.log(selCountry);

    this.setState({
        country_code: selCountry.country_code, 
        country_name: selCountry.country_name,
        selected_country: JSON.stringify({ country_code: selCountry.country_code, country_name: selCountry.country_name })
      }
    );
  }

  onSaveButtonClick(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("MyPersonalData :: onSaveButtonClick");      
      //console.log(evt);
      console.log(this.state);
    }

    const loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token,
      affiliate_id: this.props['session'].session.affiliate_id
    };

    const personalInformation = {
      backoffice_session_id: loginData.backoffice_session_id,
      email: this.state.email,
      country_id: this.state.country_code,
      zip: this.state.post_code,
      phone: this.state.mobile_phone,
      address: this.state.address,
      birthday: this.state.birthday,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      city: this.state.city,
      affiliate_id: this.props['session'].session.affiliate_id,
    };

    updatePersonalInformationService(loginData, personalInformation)
    .then((response) => {
      if(response.status == 'OK'){
        this.setState(
          {
            successMessage: 'Changes saved !',
            isSuccessMessage: true,
            errorMessage: '',
            isErrorMessage: false
          }
        );
      }else{
        this.setState(
          {
            successMessage: '',
            isSuccessMessage: false,
            errorMessage: 'Changes not saved !',
            isErrorMessage: true,
          }
        );
      }
      this.loadData();
    })
    .catch((error) => {
      console.log(error);
    });    
  }

  onCancelButtonClick(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("MyPersonalData :: onCancelButtonClick");
      //console.log(evt);
    }

    this.loadData();

    this.setState(
      {
        password: '',
        confirm_password: '',
        
        errorMessage: '',
        isErrorMessage: false,
        successMessage: '',
        isSuccessMessage: false
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

  handleChangeBirthday(date)
  {
    this.setState({
      birthday: date
    });
  }

  render() {
    return (
        <div className={this.props['classes']['content']}>            
            <Typography variant="h6" gutterBottom>              
              <PersonIcon />
              <FormattedMessage id="My Personal Data" defaultMessage="My Personal Data" />
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
                      name="path"
                      disabled
                      required
                      label={<FormattedMessage id="Path" defaultMessage="Path" />}
                      fullWidth
                      value={this.state.path}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      name="username"
                      disabled
                      required
                      label={<FormattedMessage id="Username" defaultMessage="Username" />}
                      fullWidth
                      value={this.state.username}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      name="mobile_phone"
                      required
                      label={<FormattedMessage id="Mobile Phone" defaultMessage="Mobile Phone" />}
                      fullWidth
                      value={this.state.mobile_phone}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      name="first_name"
                      label={<FormattedMessage id="First Name" defaultMessage="First Name" />}
                      fullWidth
                      onChange={(event) => { this.handleInputFieldChange('first_name', event.target.value)}}
                      value={this.state.first_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      name="last_name"
                      label={<FormattedMessage id="Last Name" defaultMessage="Last Name" />}
                      fullWidth
                      onChange={(event) => { this.handleInputFieldChange('last_name', event.target.value)}}
                      value={this.state.last_name}
                  />
                </Grid>                
                <Grid item xs={12} sm={6}>
                  <TextField
                      name="email"
                      required
                      label={<FormattedMessage id="Email" defaultMessage="Email" />}
                      fullWidth
                      onChange={(event) => { this.handleInputFieldChange('email', event.target.value)}}
                      value={this.state.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <InlineDatePicker
                      keyboard
                      clearable 
                      margin="normal"
                      label={<FormattedMessage id="Date Of Birth" defaultMessage="Date Of Birth" />}
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}                      
                      value={ this.state.birthday }
                      onChange={this.handleChangeBirthday}
                      format="dd-MMM-yyyy"
                    />
                  </MuiPickersUtilsProvider>                 
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      name="address"
                      label={<FormattedMessage id="Address" defaultMessage="Address" />}
                      fullWidth
                      onChange={(event) => { this.handleInputFieldChange('address', event.target.value)}}
                      value={this.state.address}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      name="post_code"
                      label={<FormattedMessage id="Post Code" defaultMessage="Post Code" />}
                      fullWidth
                      onChange={(event) => { this.handleInputFieldChange('post_code', event.target.value)}}
                      value={this.state.post_code}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      name="city"
                      label={<FormattedMessage id="City" defaultMessage="City" />}
                      fullWidth
                      onChange={(event) => { this.handleInputFieldChange('city', event.target.value)}}
                      value={this.state.city}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel htmlFor="country">
                    <FormattedMessage id="Country" defaultMessage="Country" />
                  </InputLabel>
                  <Select
                    value={ JSON.stringify(this.state.selected_country) }
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
                                
                <Grid item xs={12} sm={6}>                 
                  <InputLabel htmlFor="language">
                    <FormattedMessage id="Language" defaultMessage="Language" />
                  </InputLabel>
                  <Select
                    value={this.state.language}
                    onChange={this.handleChangeLanguage}
                    fullWidth
                    required
                    inputProps={{
                      name: 'language',
                      id: 'language',
                    }}
                  >
                    <MenuItem value="en_GB">
                      <FormattedMessage id="English" defaultMessage="English" />
                    </MenuItem>
                    <MenuItem value="de_DE">
                      <FormattedMessage id="German" defaultMessage="German" />
                    </MenuItem>
                    <MenuItem value="sv_SE">
                      <FormattedMessage id="Swedish" defaultMessage="Swedish" />
                    </MenuItem>
                    <MenuItem value="it_IT">
                      <FormattedMessage id="Italian" defaultMessage="Italian" />
                    </MenuItem>
                    <MenuItem value="ru_RU">
                      <FormattedMessage id="Russian" defaultMessage="Russian" />
                    </MenuItem>
                    <MenuItem value="pl_PL">
                      <FormattedMessage id="Polish" defaultMessage="Polish" />
                    </MenuItem>
                    <MenuItem value="hr_HR">
                      <FormattedMessage id="Croatian" defaultMessage="Croatian" />
                    </MenuItem>
                    <MenuItem value="rs_RS">
                      <FormattedMessage id="Serbian" defaultMessage="Serbian" />
                    </MenuItem>
                    <MenuItem value="tr_TR">
                      <FormattedMessage id="Turkish" defaultMessage="Turkish" />
                    </MenuItem>
                    <MenuItem value="cs_CZ">
                      <FormattedMessage id="Czeck" defaultMessage="Czeck" />
                    </MenuItem>
                    <MenuItem value="sq_AL">
                      <FormattedMessage id="Albanian" defaultMessage="Albanian" />
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    disabled
                    name="currency"
                    label={<FormattedMessage id="Currency" defaultMessage="Currency" />}
                    fullWidth
                    value={this.state.currency}
                  />
                </Grid>
               
                <Grid item xs={12} sm={6}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    size="medium"
                    color="primary"
                    className={this.props['classes']['submit']}
                    onClick={this.onSaveButtonClick}
                    disabled={this.state.create_button_disabled}
                  >
                    <SaveIcon />
                    <FormattedMessage id="Save" defaultMessage="Save" />
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

const hoc = connect(mapStateToProps, mapDispatchToProps)(MyPersonalData);

export default withStyles(MyPersonalDataStyle)(injectIntl(hoc));