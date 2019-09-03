import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { FormattedMessage, injectIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import HomeIcon from '@material-ui/icons/Home';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HomeStyle from "./HomeStyle";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';
import { DEBUG_CONSOLE } from '../../../configuration/Config';
import { saveLoginAction } from '../../../redux/actions/session/SessionActions';
import DateTimeHelper from '../../../helpers/DateTimeHelper';

class Home extends React.Component {
  classes
  intervalCountdown;

  state = {
    // The first commit of Material-UI
    date_time: '',
    selectedStartDate: DateTimeHelper.getFirstDayInMonth(),
    selectedEndDate: DateTimeHelper.getCurrentDayInMonth(),
    language: 'en_GB',
    username: '',
    actual_location: '',
    last_login_date_time: '',
    last_login_location: '',      
  };

  static propTypes = {
    session: PropTypes.object,
    saveLoginAction: PropTypes.func.isRequired
  }

  constructor(props, context)
  {
    super(props, context);

    this.classes = props.classes;

    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  componentWillUnmount()
  {
    clearInterval(this.intervalCountdown);
  }

  componentDidMount()
  {
    this.loadData();
    this.intervalDateTime();
  }

  calculateCurrentDateTime()
  {
    var date = new Date();

    var monthNames = ["Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov",
        "Dec"
    ];

    var monthDay = date.getDate();
    var year = date.getFullYear();
    var monthName = monthNames[date.getMonth()];  
    
    return (monthDay + "-" + monthName + "-" + year + "     " + date.toLocaleTimeString());
  }

  intervalDateTime()
  {
    let currentDateTime = '';
    this.intervalCountdown = setInterval(
      () => {
          currentDateTime = this.calculateCurrentDateTime();    
          
          this.setState(
            { date_time: currentDateTime }
          );
      }, 1000
    );
  }

  loadData()
  {
    if(DEBUG_CONSOLE){
      console.log("Home :: loadData");
      console.log(this.props['session']);
    }

    let loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id
    };

    this.setState(
      {
        username: this.props['session'].session.username,
        report_start_date: this.props['session']['session']['report_start_date']  || '',
        report_end_date: this.props['session']['session']['report_end_date']  || '',
        language: this.props['session']['session']['language']  || 'en_GB'
      }
    )
  }

  handleStartDateChange(date)
  {
    this.setState({ selectedStartDate: date });
    
    this.props['session']['session']['report_start_date'] = DateTimeHelper.getFormattedDate(date);
    this.props['saveLoginAction'](this.props['session']['session']);
    if(DEBUG_CONSOLE){
      console.log("Home :: handleStartDateChange");
      console.log(date);
    }
  };

  handleEndDateChange(date)
  {
    this.setState({ selectedEndDate: date });
    this.props['session']['session']['report_end_date'] = DateTimeHelper.getFormattedDate(date);
    this.props['saveLoginAction'](this.props['session']['session']);
    if(DEBUG_CONSOLE){
      console.log("Home :: handleEndDateChange");
      console.log(date);
    }
  };

  handleDateChange(date) 
  {
    if(DEBUG_CONSOLE){
      console.log(date);
    }
  }

  handleDateDismiss(date)
  {
    if(DEBUG_CONSOLE){
      console.log(date);
    }
  }

  handleChangeLanguage(evt)
  {
    if(DEBUG_CONSOLE){
      console.log("Home :: handleChangeLanguage");
      console.log(evt.target.value);
    }
    this.setState({ language: evt.target.value });
    this.props['session']['session']['language'] = evt.target.value;
    this.props['saveLoginAction'](this.props['session']['session']);
  }

  render() 
  {
    const selectedStartDate = this.state.selectedStartDate;
    const selectedEndDate = this.state.selectedEndDate;

    return (
        <div className={this.classes['content']}>            
            <Typography variant="h6" gutterBottom>              
              <HomeIcon />
              <FormattedMessage id="Home" defaultMessage="Home" />
            </Typography>
            <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                  <TextField
                      name="username"
                      disabled
                      label={<FormattedMessage id="Username" defaultMessage="Username" />}
                      fullWidth
                      autoComplete="username"
                      value={this.state['username']}                      
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                      name="date_time"
                      disabled
                      label={<FormattedMessage id="Date & Time" defaultMessage="Date & Time" />}
                      fullWidth
                      autoComplete="date_time"
                      value={this.state['date_time']}
                  />
                </Grid>                
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <InlineDatePicker
                        keyboard
                        clearable
                        margin="normal"
                        label={<FormattedMessage id="Start Date" defaultMessage="Start Date" />}
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={selectedStartDate}
                        onChange={this.handleStartDateChange}
                        format="dd-MMM-yyyy"
                      />
                  </MuiPickersUtilsProvider>  
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>    
                    <InlineDatePicker
                      keyboard
                      margin="normal"
                      label={<FormattedMessage id="End Date" defaultMessage="End Date" />}
                      fullWidth
                      InputLabelProps={{
                        shrink: true                        
                      }}
                      value={selectedEndDate}
                      onChange={this.handleEndDateChange}
                      format="dd-MMM-yyyy"
                    />
                  </MuiPickersUtilsProvider>        
                </Grid>
                
                <Grid item xs={12} sm={6}>                 
                  <InputLabel htmlFor="language">
                    <FormattedMessage id="Language" defaultMessage="Language" />
                  </InputLabel>
                  <Select
                    value={this.state.language}
                    onChange={this.handleChangeLanguage}
                    fullWidth
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

const hoc = connect(mapStateToProps, mapDispatchToProps)(Home);

export default withStyles(HomeStyle)(injectIntl(hoc));