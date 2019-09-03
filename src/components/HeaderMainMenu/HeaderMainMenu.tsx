
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from "classnames";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ExitIcon from '@material-ui/icons/ExitToApp';
import BuildIcon from '@material-ui/icons/Build';
import PeopleIcon from '@material-ui/icons/People';
import LanguageIcon from '@material-ui/icons/Language';
import { FormattedMessage } from 'react-intl';
import HeaderMainMenuStyle from "./HeaderMainMenuStyle";
import { setLanguageAction } from '../../redux/actions/language/LanguageActions';
import { logoutAction } from '../../redux/actions/session/SessionActions';
import { setMenuAction, setSubmenuVisibleAction } from '../../redux/actions/menu/MenuActions';
import Hidden from '@material-ui/core/Hidden';

class HeaderMainMenu extends React.Component {

    classes = null;

    static propTypes = {
        classes: PropTypes.object.isRequired,
        routes: PropTypes.array,
        notifyVisibleSubmenu: PropTypes.func.isRequired,
        notifyToggleSidebar: PropTypes.func.isRequired,
            
        language: PropTypes.string,
        language_messages: PropTypes.object,
        setLanguageAction: PropTypes.func.isRequired,
        logoutAction: PropTypes.func.isRequired,

        setMenuAction: PropTypes.func.isRequired,
        
        session: PropTypes.object,
        menu: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.handleHomeButtonClick = this.handleHomeButtonClick.bind(this);
        this.handleMyAccountButtonClick = this.handleMyAccountButtonClick.bind(this);

        this.handleLanguageButtonClick = this.handleLanguageButtonClick.bind(this);

        this.handleLogoutButtonClick = this.handleLogoutButtonClick.bind(this);
    }

    handleHomeButtonClick(){
        this.props['history'].push('/authenticated/home');
        this.props['setSubmenuVisibleAction'](false);
    }

    handleMyAccountButtonClick(){
        this.props['setMenuAction']('my_account');
        this.props['setSubmenuVisibleAction'](true);
    }

    handleLanguageButtonClick(){
        this.props['setMenuAction']('language');
        this.props['setSubmenuVisibleAction'](true);
    }

    handleLogoutButtonClick(){
        this.props['logoutAction']({ backoffice_session_id: this.props['session'].backoffice_session_id, jwt_token: this.props['session'].jwt_token })
        .then((response) => {
            localStorage.clear();
            this.props['history'].push('/login'); 
          });
    }

    render() {
        return(
        <AppBar position="fixed"
        className={classNames(this.props['classes'].appBar, this.props['openSidebar'] && this.props['classes'].appBarShift)}>
            <Toolbar>
                <IconButton className={this.props['classes'].menuButton} color="inherit" aria-label="Menu" onClick={this.props['notifyToggleSidebar']}>
                    <MenuIcon />
                </IconButton>
                
                <Typography variant="h6" color="inherit">
                    <FormattedMessage id="BackOffice Vouchers" defaultMessage="BackOffice Vouchers" />
                </Typography>
                
                <Hidden smDown>
                    <div className={this.props['classes'].leftToolbarButtons}>
                        <Button color="inherit" onClick={this.handleHomeButtonClick}>
                            <HomeIcon />
                            <FormattedMessage id="Home" defaultMessage="Home" />
                        </Button>
                        <Button color="inherit" onClick={this.handleMyAccountButtonClick}>
                            <PersonIcon />
                            <FormattedMessage id="My Account" defaultMessage="My Account" />
                        </Button>
                        <Button color="inherit" onClick={this.handleLanguageButtonClick}>
                            <LanguageIcon />
                            <FormattedMessage id="Languages" defaultMessage="Language" />
                        </Button>                    
                    </div>
                </Hidden>
                
                <div className={this.props['classes'].grow} />

                <Button color="inherit" onClick={this.handleLogoutButtonClick} className={this.props['classes']['logoutButton']}>
                    <ExitIcon />
                    <FormattedMessage id="Logout" defaultMessage="Logout" />
                </Button>
                
            </Toolbar>
        </AppBar>
        );
    }
}

// CONFIGURE REACT REDUX

const mapStateToProps = state => {
    const { language, language_messages, setLanguageAction, logoutAction} = state.languageState;
    const { session } = state.session;  
    const { menu, setMenuAction, setSubmenuVisibleAction } = state.menu;
    return { language, language_messages, setLanguageAction, logoutAction, session, menu, setMenuAction, setSubmenuVisibleAction };
};
  
const mapDispatchToProps = dispatch => (
    bindActionCreators({ setLanguageAction, logoutAction, setMenuAction, setSubmenuVisibleAction }, dispatch)
);
  
const hoc = connect(mapStateToProps, mapDispatchToProps)(HeaderMainMenu);

export default withStyles(HeaderMainMenuStyle)(hoc);