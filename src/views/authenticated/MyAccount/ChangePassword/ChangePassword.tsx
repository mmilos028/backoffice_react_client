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
import KeyIcon from '@material-ui/icons/VpnKey';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ChangePasswordStyle from "./ChangePasswordStyle";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';
import { WithStyles } from '@material-ui/core';
import classNames from 'classnames';
import { DEBUG_CONSOLE } from '../../../../configuration/Config';
import { changePasswordService } 
from '../../../../redux/services/my_account/MyPersonalDataService';
import { saveLoginAction } from '../../../../redux/actions/session/SessionActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class ChangePasswordData extends React.Component {

  state = {
    user_id: '',
    username: '',
    password: '',
    confirm_password: '',
    
    errorMessage: '',
    isErrorMessage: false,
    successMessage: '',
    isSuccessMessage: false,

    showPassword: false,
    showConfirmPassword: false,

    save_button_disabled: true
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

    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
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
      console.log("My Account \ My Personal Data :: loadData");
      console.log(this.props['session']);
    }

    this.setState(
      {
        user_id: this.props['session'].session.user_id || '',
        username: this.props['session'].session.username || '',
        save_button_disabled: false
      }
    );
  }

  handleChangeLanguage(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("ChangePassword :: handleChangeLanguage");
      console.log(evt.target.value);
    }
    this.setState({ language: evt.target.value });
    this.props['session']['session']['language'] = evt.target.value;
    this.props['saveLoginAction'](this.props['session']['session']);
  }

  handleChangeCountry(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("ChangePassword :: handleChangeCountry");
      console.log(evt.target.value);
    }
  }

  onSaveButtonClick(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("ChangePassword :: onSaveButtonClick");      
      //console.log(evt);
      console.log(this.state);
    }

    if(this.state['password'] == '' || this.state['confirm_password'] == ''){
      this.setState(
        {
          successMessage: '',
          isSuccessMessage: false,
          errorMessage: <FormattedMessage id="Password / Confirm Password cannot be empty value" defaultMessage="Password / Confirm Password cannot be empty value" />,
          isErrorMessage: true,
        }
      );
      return;
    }

    if(this.state['password'] != this.state['confirm_password']){
      this.setState(
        {
          successMessage: '',
          isSuccessMessage: false,
          errorMessage: <FormattedMessage id="Password / Confirm Password do not match" defaultMessage="Password / Confirm Password do not match" />,
          isErrorMessage: true,
        }
      );
      return;
    }

    this.loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token
    };

    let changePasswordData = {
      user_id: this.state['user_id'],
      username: this.state['username'],
      password: this.state['password']
    };

    changePasswordService(this.loginData, changePasswordData)
    .then((response) => {
      if(response.status == 'OK'){
        //console.log(response);
        if(DEBUG_CONSOLE){
          console.log(response);
        }
        this.setState(
          {
            successMessage: <FormattedMessage id="Changes saved" defaultMessage="Changes saved" />,
            isSuccessMessage: true,
            errorMessage: '',
            isErrorMessage: false,

            save_button_disabled: false
          }
        );
      }else{
        this.setState(
          {
            successMessage: '',
            isSuccessMessage: true,
            errorMessage: <FormattedMessage id="Changes not saved" defaultMessage="Changes not saved" />,
            isErrorMessage: true,

            save_button_disabled: false
          }
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });

    this.loadData();
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state['showPassword'] }));
  };

  handleClickShowConfirmPassword = () => {
    this.setState(state => ({ showConfirmPassword: !state['showConfirmPassword'] }));
  };

  handlePassword(event){
    this.setState({ password: event.target.value || '' });
  }

  handleConfirmPassword(event){
    this.setState({ confirm_password: event.target.value || '' });
  }

  onCancelButtonClick(evt){
    if(DEBUG_CONSOLE){
      console.log("ChangePassword :: onCancelButtonClick");
    }

    this.loadData();

    this.setState(
      {
        errorMessage: '',
        isErrorMessage: false,
        successMessage: '',
        isSuccessMessage: false
      }
    );
  }

  render() {
    return (
        <div className={this.props['classes']['content']}>
            <Grid container>
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  <KeyIcon />
                  <FormattedMessage id="Change Password" defaultMessage="Change Password" />
                </Typography>
              </Grid>
            </Grid>
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
                      name="username"
                      disabled
                      required
                      label={<FormattedMessage id="Username" defaultMessage="Username" />}
                      fullWidth
                      autoComplete="username"
                      value={this.state.username}
                  />
                </Grid>                
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth              
                    className={classNames(this.props['classes']['margin'], this.props['classes']['textField'])}
                    type={this.state.showPassword ? 'text' : 'password'}
                    label={<FormattedMessage id="Password" defaultMessage="Password" />}
                    onChange={this.handlePassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowPassword}
                          >
                            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth              
                    className={classNames(this.props['classes']['margin'], this.props['classes']['textField'])}
                    type={this.state.showConfirmPassword ? 'text' : 'password'}
                    label={<FormattedMessage id="Confirm Password" defaultMessage="Confirm Password" />}
                    onChange={this.handleConfirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowConfirmPassword}
                          >
                            {this.state.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                    disabled={this.state.save_button_disabled}
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

const hoc = connect(mapStateToProps, mapDispatchToProps)(ChangePasswordData);

export default withStyles(ChangePasswordStyle)(injectIntl(hoc));