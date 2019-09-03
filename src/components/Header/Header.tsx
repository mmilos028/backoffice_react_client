
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

import HeaderStyle from "./HeaderStyle";

import { setLanguageAction } from '../../redux/actions/language/LanguageActions';

import { logoutAction } from '../../redux/actions/session/SessionActions';
import { FormattedMessage } from 'react-intl';

class Header extends React.Component {

    classes = null;

    static propTypes = {
        classes: PropTypes.object.isRequired,
        routes: PropTypes.array,
        openSidebar: PropTypes.bool.isRequired,
        notifySidebarState: PropTypes.func.isRequired,
            
        language: PropTypes.string,
        language_messages: PropTypes.object,
        setLanguageAction: PropTypes.func.isRequired,
        logoutAction: PropTypes.func.isRequired,
        
        session: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.classes = props.classes;

        this.handleLogoutButtonClick = this.handleLogoutButtonClick.bind(this);
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
        <AppBar position="absolute" className={classNames(this.props['classes'].appBar, this.props['openSidebar'] && this.props['classes'].appBarShift)}>
            <Toolbar>
                <IconButton className={this.classes.menuButton} color="inherit" aria-label="Menu" onClick={this.props['notifySidebarState']}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" className={this.classes.grow}>
                    <FormattedMessage id="BackOffice" defaultMessage="BackOffice" />
                </Typography>
                <Button color="inherit" onClick={this.handleLogoutButtonClick} className={this.props['classes']['logoutButton']}>
                    <FormattedMessage id="Logout" defaultMessage="Logout" />
                </Button>
            </Toolbar>
        </AppBar>
        );
    }
}

// CONFIGURE REACT REDUX

const mapStateToProps = state => {
    const { language, language_messages, setLanguageAction, logoutAction } = state.languageState;
    const { session } = state.session;  
    return { language, language_messages, setLanguageAction, logoutAction, session };
};
  
const mapDispatchToProps = dispatch => (
    bindActionCreators({ setLanguageAction, logoutAction }, dispatch)
);
  
const hoc = connect(mapStateToProps, mapDispatchToProps)(Header);

export default withStyles(HeaderStyle)(hoc);