import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { WithStyles } from '@material-ui/core';
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from 'classnames';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { FormattedMessage, injectIntl } from 'react-intl';
import LoginPageStyle from './LoginPageStyle';
import { HOME_PAGE } from '../../configuration/Config';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loginAction, logoutAction, saveLoginAction } from '../../redux/actions/session/SessionActions';
import CircularProgress from '@material-ui/core/CircularProgress';

interface Props extends WithStyles<typeof LoginPageStyle>{
  //additional props here
}

class LoginPage extends React.Component<Props> {

  username = '';
  password = '';
  state = null;

  static propTypes = {
    classes: PropTypes.object,

    loginAction: PropTypes.func.isRequired,
    logoutAction: PropTypes.func,
    saveLoginAction: PropTypes.func,
    setDeviceMacAddressAction: PropTypes.func,
  
    session: PropTypes.object,
    mac_address: PropTypes.object
  }

  constructor(props)
  {
    super(props);

    this.state = {
      username: '',
      password: '',
      errorMessage: '',
      isErrorMessage: false,
      showPassword: false,
      loginStarted: false
    }   

    this.onLoginButtonClick = this.onLoginButtonClick.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.onKeyPressPassword = this.onKeyPressPassword.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
  }

  componentWillUnmount()
  {
  }

  componentDidMount()
  {
  }

  handleUsername(event) 
  {
    this.setState({ username: event.target.value || '' });
  }
  
  handlePassword(event)
  {
    this.setState({ password: event.target.value || '' });
  }

  onKeyPressPassword(event)
  {
    if(event.charCode === 13) {
      this.onLoginButtonClick();
    }
  }

  handleClickShowPassword()
  {
    this.setState(state => ({ showPassword: !state['showPassword'] }));
  }

  onLoginButtonClick()
  {
    if(!this.state.username || !this.state.password){
        this.setState(
          {
            errorMessage: <FormattedMessage id="Username and password are required values !" defaultMessage="Username and password are required values !" />,
            isErrorMessage: true,
            loginStarted: false
          }
        );
        return;
    }

    let loginData = {
      username: this.state.username,
      password: this.state.password
    };

    this.setState(
      {
          loginStarted: true
      }
    );

    this.props['loginAction'](loginData).then((response) => {
      if(response.value.status === 'OK'){
        response.value.selected_mac_address = this.state.mac_address;
        response.value.list_mac_address = this.state.list_mac_address;
        this.props['saveLoginAction'](response.value);

        this.setState(
          {
              loginStarted: false
          }
        );

        this.props['history'].push(HOME_PAGE);
      }else{
        this.setState(
            {
                errorMessage: response.value.message,
                isErrorMessage: true,
                loginStarted: false
            }
        );
      }
    });
  }

  render() {
    return (
      <main className={this.props.classes['main']}>
        <CssBaseline />
        <Paper className={this.props.classes['paper']}>
          <Avatar className={this.props.classes['avatar']}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            <FormattedMessage id="Sign in to start your session" defaultMessage="Sign in to start your session" />
          </Typography>
          <FormHelperText error={this.state.isErrorMessage} variant={'filled'} className={this.props.classes["validationMessage"]}>
            {this.state.errorMessage}
          </FormHelperText>
          <form className={this.props.classes['form']}>            
            <TextField              
              fullWidth
              className={classNames(this.props.classes.margin, this.props.classes.textField)}
              variant="outlined"
              type={'text'}
              label={<FormattedMessage id="Username" defaultMessage="Username" />}
              onChange={this.handleUsername}            
            />
            <TextField
              fullWidth              
              className={classNames(this.props.classes.margin, this.props.classes.textField)}
              variant="outlined"
              type={this.state.showPassword ? 'text' : 'password'}
              label={<FormattedMessage id="Password" defaultMessage="Password" />}
              onChange={this.handlePassword}
              onKeyPress={this.onKeyPressPassword}
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

            <Button
              type="button"
              fullWidth
              variant="contained"
              size="large"
              color="primary"
              className={this.props.classes['submit']}
              onClick={this.onLoginButtonClick}
              disabled={this.state.loginStarted}
            >
              { this.state.loginStarted && <CircularProgress size={24} thickness={4} variant="indeterminate" /> }
              <FormattedMessage id="Login" defaultMessage="Login" />
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

const mapStateToProps = state => {
  const { session } = state.session;
  
  return { session };
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({ loginAction, logoutAction, saveLoginAction }, dispatch)
);

const hoc = connect(mapStateToProps, mapDispatchToProps)(withStyles(LoginPageStyle)(LoginPage));

export default injectIntl(hoc);