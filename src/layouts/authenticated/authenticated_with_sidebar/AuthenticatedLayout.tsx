/* eslint-disable */
import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import clsx from 'clsx';
// core components
import CssBaseline from '@material-ui/core/CssBaseline';
import HeaderMainMenu from "../../../components/HeaderMainMenu/HeaderMainMenu";
import authenticatedRoutes from "../../../routes/Authenticated";

import { IntlProvider, addLocaleData, FormattedMessage } from 'react-intl';
import en from "react-intl/locale-data/en";
import sr from "react-intl/locale-data/sr";
import { MuiThemeProvider, withTheme } from '@material-ui/core/styles';
import Theme from '../../../theme/Theme';
import AuthenticatedLayoutStyle from "./AuthenticatedLayoutStyle";
import { initLanguageAction, setLanguageAction } from '../../../redux/actions/language/LanguageActions';
import {
  pingSessionAction, validateSessionAction, logoutAction,
  getSessionRemainingTimeAction
} from '../../../redux/actions/session/SessionActions';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HeaderSubMenu from "../../../components/HeaderSubMenu/HeaderSubMenu";
import { setMenuAction, setSubmenuVisibleAction } from '../../../redux/actions/menu/MenuActions';
import { DEBUG_CONSOLE } from "../../../configuration/Config";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HomeIcon from '@material-ui/icons/Home';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import PersonIcon from '@material-ui/icons/Person';
import KeyIcon from '@material-ui/icons/VpnKey';
import BuildIcon from '@material-ui/icons/Build';
import SearchIcon from '@material-ui/icons/Search';
import LanguageIcon from '@material-ui/icons/Language';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

const history = createBrowserHistory();

const switchRoutes = (
  <Switch>
    {authenticatedRoutes.map((prop, key) => {
      if (prop['redirect'])
        return <Redirect from={prop.path} to={prop['to']} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} history={history} />;
    })}
  </Switch>
);

addLocaleData([...en, ...sr]);

const p_language = 'en';

class AuthenticatedLayout extends React.Component {

  classes = null;
  startIntervalValidateSession = null;
  startIntervalSessionRemainingTime = null;

  static propTypes = {
    classes: PropTypes.object.isRequired,
    language: PropTypes.string,
    language_messages: PropTypes.object,
    session: PropTypes.object,
    menu: PropTypes.string,

    setSubmenuVisibleAction: PropTypes.func.isRequired,
    initLanguageAction: PropTypes.func.isRequired,
  };

  state = {
    openSidebar: false,
    openExtendSessionDialog: false,

    openMyAccount: false,
    openVouchers: false,
    openUsersAndAdministrators: false,

    openLanguages: false
  };

  constructor(props) 
  {
    super(props);

    if (window.innerWidth <= 960) {
      this.state = {
        openSidebar: true,
        openExtendSessionDialog: false,

        openMyAccount: false,
        openVouchers: false,
        openUsersAndAdministrators: false,

        openLanguages: false
      };
    } else {
      this.state = {
        openSidebar: false,
        openExtendSessionDialog: false,

        openMyAccount: false,
        openVouchers: false,
        openUsersAndAdministrators: false,

        openLanguages: false
      };
    }

    this.resizeFunction = this.resizeFunction.bind(this);
    this.toggleSubmenuVisible = this.toggleSubmenuVisible.bind(this);
    this.handleOpenExtendSessionDialogClick = this.handleOpenExtendSessionDialogClick.bind(this);
    this.handleCloseExtendSessionDialogClick = this.handleCloseExtendSessionDialogClick.bind(this);
    this.handleExtendSessionClick = this.handleExtendSessionClick.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);

    this.props['initLanguageAction'](p_language);

    if (!this.props['session'].session.backoffice_session_id) {
      localStorage.clear();
      this.props['history'].push('/login');
    }

    const loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token,
    };

    this.startIntervalValidateSession = setInterval(() => {
      this.props['validateSessionAction'](loginData)
        .then((response) => {
          if (DEBUG_CONSOLE) {
            console.log(response);
          }
          if (!response.value.status && response.value.status != "OK") {
            this.props['logoutAction'](loginData)
              .then((response) => {
                localStorage.clear();
                this.props['history'].push('/login');
              });

          }
        })
        .catch((error) => {
          console.log(error);
          this.props['logoutAction'](loginData)
            .then((response) => {
              localStorage.clear();
              this.props['history'].push('/login');
            });

        })
    }, 60000);

    this.startIntervalSessionRemainingTime = setInterval(() => {
      this.props['getSessionRemainingTimeAction'](loginData)
        .then((response) => {
          if (DEBUG_CONSOLE) {
            console.log(response);
          }
          if (!response.value.status && response.value.status != "OK") {
            this.props['logoutAction'](loginData)
              .then((response) => {
                localStorage.clear();
                this.props['history'].push('/login');
              });
          }

          if (response.value.remaining_seconds && response.value.remaining_seconds < 120) {
            if (response.value.remaining_seconds <= 1) {
              this.props['logoutAction'](loginData)
                .then((response) => {
                  localStorage.clear();
                  this.props['history'].push('/login');
                });
            } else {
              this.handleOpenExtendSessionDialogClick();
            }
          }

        })
        .catch((error) => {
          console.log(error);
          this.props['logoutAction'](loginData)
            .then((response) => {
              localStorage.clear();
              this.props['history'].push('/login');
            });
        })
    }, 120000);

  }

  getRoute() 
  {
    return this.props['location'].pathname !== "/maps";
  }

  resizeFunction() 
  {

  }

  componentDidMount() 
  {
    window.addEventListener("resize", this.resizeFunction);
  }

  componentWillUnmount() 
  {
    window.removeEventListener("resize", this.resizeFunction);
    clearInterval(this.startIntervalValidateSession);
    clearInterval(this.startIntervalSessionRemainingTime);
  }

  handleDrawerOpen()
  {
    this.setState({ 
      openSiderbar: true 
    });
  };

  handleDrawerClose()
  {
    this.setState({ 
      openSidebar: false 
    });
  };

  handleDrawerToggle() 
  {
    this.setState({ 
      openSidebar: !this.state.openSidebar 
    });
  };

  toggleSubmenuVisible() 
  {
    //this.setState({ openSidebar: !this.state['openSidebar'] });
    if (DEBUG_CONSOLE) {
      console.log("AuthenticatedLayout :: toogleSubmenuVisible");
      console.log(this.props['submenu_visibility']);
    }

    this.props['setSubmenuVisibleAction'](!this.props['submenu_visibility']);
  }

  handleOpenExtendSessionDialogClick()
  {
    this.setState({ 
      openExtendSessionDialog: true 
    });
  };

  handleCloseExtendSessionDialogClick()
  {
    this.setState({ 
      openExtendSessionDialog: false 
    });
  };

  handleChangeLanguageClick(language)
  {
    this.props['setLanguageAction'](language);
  }

  handleExtendSessionClick() 
  {
    let loginData = {
      backoffice_session_id: this.props['session'].session.backoffice_session_id,
      jwt_token: this.props['session'].session.jwt_token
    };

    this.props['validateSessionAction'](loginData)
      .then((response) => {
        if (DEBUG_CONSOLE) {
          console.log(response);
        }
        if (!response.value.status && response.value.status != "OK") {
          this.props['logoutAction'](loginData)
            .then((response) => {
              localStorage.clear();
              this.props['history'].push('/login');
            });
        }
        this.setState({ 
          openExtendSessionDialog: false 
        });
      })
      .catch((error) => {
        console.log(error);
        this.props['logoutAction'](loginData)
          .then((response) => {
            localStorage.clear();
            this.props['history'].push('/login');
          });
      })

  };

  render() {
    const classes = this.props['classes'];
    return (

      <MuiThemeProvider theme={Theme}>
        <IntlProvider locale={this.props['language']} messages={this.props['language_messages']}>
          <div className={classes['root']}>
            <CssBaseline />
            {
              <HeaderMainMenu
                {...this.props}
                routes={authenticatedRoutes}
                notifyVisibleSubmenu={this.toggleSubmenuVisible}
                notifyToggleSidebar={this.handleDrawerToggle}
              />
            }
            {
              this.props['submenu_visibility'] &&
              <HeaderSubMenu
                {...this.props}
                routes={authenticatedRoutes}
                notifyVisibleSubmenu={this.toggleSubmenuVisible}
              />
            }
            <Drawer
              className={this.props['classes'].drawer}
              variant="persistent"
              anchor="left"
              open={this.state.openSidebar}
              classes={{
                paper: this.props['classes'].drawerPaper,
              }}
            >
              <div className={this.props['classes'].drawerHeader}>
                <IconButton onClick={this.handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              <List>

                <ListItem button onClick={(event) => this.props['history'].push('/authenticated/home')}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={<FormattedMessage id="Home" defaultMessage="Home" />} />
                </ListItem>

                <ListItem button onClick={(event) => { this.setState({ openMyAccount: !this.state.openMyAccount }); }}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={<FormattedMessage id="My Account" defaultMessage="My Account" />} />
                  {this.state.openMyAccount ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.openMyAccount} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    <ListItem button className={classes.nested} onClick={(event) => this.props['history'].push('/authenticated/my-account/my-personal-data')}>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary={<FormattedMessage id="My Personal Data" defaultMessage="My Personal Data" />} />
                    </ListItem>
                    <ListItem button className={classes.nested} onClick={(event) => this.props['history'].push('/authenticated/my-account/change-password')}>
                      <ListItemIcon>
                        <KeyIcon />
                      </ListItemIcon>
                      <ListItemText primary={<FormattedMessage id="Change Password" defaultMessage="Change Password" />} />
                    </ListItem>
                  </List>
                </Collapse>

                <ListItem button onClick={(event) => { this.setState({ openVouchers: !this.state.openVouchers }); }}>
                  <ListItemIcon>
                    <BuildIcon />
                  </ListItemIcon>
                  <ListItemText primary={<FormattedMessage id="Vouchers" defaultMessage="Vouchers" />} />
                  {this.state.openVouchers ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.openVouchers} timeout="auto" unmountOnExit>
                  <List disablePadding>

                    <ListItem button className={classes.nested} 
                    onClick={(event) => this.props['history'].push('/authenticated/administration/vouchers/search-prepaid-cards')}>
                      <ListItemIcon>
                        <SearchIcon />
                      </ListItemIcon>
                      <ListItemText primary={<FormattedMessage id="List / Search Voucher" defaultMessage="List / Search Voucher" />} />
                    </ListItem>

                    <ListItem button className={classes.nested} 
                    onClick={(event) => this.props['history'].push('/authenticated/administration/vouchers/create-voucher-card')}>
                      <ListItemIcon>
                        <AddIcon />
                      </ListItemIcon>
                      <ListItemText primary={<FormattedMessage id="Create Voucher Card" defaultMessage="Create Voucher Card" />} />
                    </ListItem>

                    <ListItem button className={classes.nested} 
                    onClick={(event) => this.props['history'].push('/authenticated/administration/vouchers/edit-voucher-card')}>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText primary={<FormattedMessage id="Edit Voucher Card" defaultMessage="Edit Voucher Card" />} />
                    </ListItem>

                    <ListItem button className={classes.nested} 
                    onClick={(event) => this.props['history'].push('/authenticated/administration/vouchers/create-member-card')}>
                      <ListItemIcon>
                        <AddIcon />
                      </ListItemIcon>
                      <ListItemText primary={<FormattedMessage id="Create Member Card" defaultMessage="Create Member Card" />} />
                    </ListItem>

                    <ListItem button className={classes.nested} 
                    onClick={(event) => this.props['history'].push('/authenticated/administration/vouchers/edit-member-card')}>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText primary={<FormattedMessage id="Edit Member Card" defaultMessage="Edit Member Card" />} />
                    </ListItem>

                  </List>
                </Collapse>

                <ListItem button onClick={(event) => { this.setState({ openUsersAndAdministrators: !this.state.openUsersAndAdministrators }); }}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={<FormattedMessage id="Users / Administrators" defaultMessage="Users / Administrators" />} />
                  {this.state.openUsersAndAdministrators ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.openUsersAndAdministrators} timeout="auto" unmountOnExit>
                  <List disablePadding>

                    <ListItem button className={classes.nested}
                    onClick={(event) => this.props['history'].push('/authenticated/administration/users-and-administrators/new-user')}
                    >                      
                      <PersonIcon />
                      <ListItemText primary={<FormattedMessage id="New User" defaultMessage="New User" />} />
                    </ListItem>

                  </List>
                </Collapse>


                <ListItem button onClick={(event) => { this.setState({ openLanguages: !this.state.openLanguages }); }}>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText primary={<FormattedMessage id="Languages" defaultMessage="Languages" />} />
                  {this.state.openLanguages ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.openLanguages} timeout="auto" unmountOnExit>
                  <List disablePadding>

                    <ListItem button className={classes.nested} onClick={(event) => this.handleChangeLanguageClick("en")}>                      
                      <ListItemText primary={<FormattedMessage id="English" defaultMessage="English" />} />
                    </ListItem>

                    <ListItem button className={classes.nested} onClick={(event) => this.handleChangeLanguageClick("en")}>                      
                      <ListItemText primary={<FormattedMessage id="German" defaultMessage="German" />} />
                    </ListItem>

                    <ListItem button className={classes.nested} onClick={(event) => this.handleChangeLanguageClick("en")}>                      
                      <ListItemText primary={<FormattedMessage id="Swedish" defaultMessage="Swedish" />} />
                    </ListItem>

                    <ListItem button className={classes.nested} onClick={(event) => this.handleChangeLanguageClick("en")}>                      
                      <ListItemText primary={<FormattedMessage id="Italian" defaultMessage="Italian" />} />
                    </ListItem>

                    <ListItem button className={classes.nested} onClick={(event) => this.handleChangeLanguageClick("sr")}>                      
                      <ListItemText primary={<FormattedMessage id="Serbian" defaultMessage="Serbian" />} />
                    </ListItem>

                    <ListItem button className={classes.nested} onClick={(event) => this.handleChangeLanguageClick("en")}>                      
                      <ListItemText primary={<FormattedMessage id="Albanian" defaultMessage="Albanian" />} />
                    </ListItem>

                  </List>
                </Collapse>

              </List>
              <Divider />
            </Drawer>
            {/* On the /maps route we want the map to be on full screen - 
              this is not possible if the content and conatiner classes are present 
              because they have some paddings which would make the map smaller */}
            <div className={clsx(this.props['classes'].content, {
              [this.props['classes'].contentShift]: this.state.openSidebar,
            })}>
              {this.getRoute() ? (
                <div>
                  <div>
                    {switchRoutes}
                  </div>
                </div>
              ) : (
                  <div>{switchRoutes}</div>
                )}
            </div>
            <Dialog
              open={this.state['openExtendSessionDialog']}
              onClose={this.handleCloseExtendSessionDialogClick}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{<FormattedMessage id="Extend your session !" defaultMessage="Extend your session !" />}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <FormattedMessage id="You have been inactive for too long. Your session will expire in about a minute, unless you extend it or be active." defaultMessage="You have been inactive for too long. Your session will expire in about a minute, unless you extend it or be active." />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleExtendSessionClick} color="primary">
                  <FormattedMessage id="Extend" defaultMessage="Extend" />
                </Button>
                <Button onClick={this.handleCloseExtendSessionDialogClick} color="default" autoFocus>
                  <FormattedMessage id="Cancel" defaultMessage="Cancel" />
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

// CONFIGURE REACT REDUX

const mapStateToProps = state => {
  const session = state.session;

  const { language, language_messages, initLanguageAction, setLanguageAction } = state.languageState;

  const { menu, submenu_visibility, setMenuAction, setSubmenuVisibleAction } = state.menu;

  return { language, language_messages, initLanguageAction, setLanguageAction, session, menu, submenu_visibility, setMenuAction, setSubmenuVisibleAction };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    initLanguageAction, setLanguageAction, pingSessionAction, validateSessionAction, getSessionRemainingTimeAction,
    logoutAction, setMenuAction, setSubmenuVisibleAction
  }, dispatch)
);

const hoc = connect(mapStateToProps, mapDispatchToProps)(AuthenticatedLayout);

export default withStyles(AuthenticatedLayoutStyle)(withTheme()(hoc));
