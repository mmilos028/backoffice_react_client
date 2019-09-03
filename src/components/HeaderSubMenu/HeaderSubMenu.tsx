
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from "classnames";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import KeyIcon from '@material-ui/icons/VpnKey';
import IconButton from '@material-ui/core/IconButton';
import HideMenuIcon from '@material-ui/icons/Close';
import HeaderSubMenuStyle from "./HeaderSubMenuStyle";
import { setLanguageAction } from '../../redux/actions/language/LanguageActions';
import { logoutAction } from '../../redux/actions/session/SessionActions';
import { setSubmenuVisibleAction } from '../../redux/actions/menu/MenuActions';
import { FormattedMessage } from 'react-intl';
import SearchIcon from '@material-ui/icons/Search';

class HeaderSubMenu extends React.Component {

    classes = null;

    static propTypes = {
        classes: PropTypes.object.isRequired,
        routes: PropTypes.array,        
            
        language: PropTypes.string,
        language_messages: PropTypes.object,
        session: PropTypes.object,
        menu: PropTypes.string,

        setLanguageAction: PropTypes.func.isRequired,
        logoutAction: PropTypes.func.isRequired,
        setSubmenuVisibleAction: PropTypes.func.isRequired,

        notifyVisibleSubmenu: PropTypes.func.isRequired,
        
    }

    constructor(props) {
        super(props);
        this.classes = props.classes;

        this.handleLogoutButtonClick = this.handleLogoutButtonClick.bind(this);
        this.handleUnimplementedMenuButtonClick = this.handleUnimplementedMenuButtonClick.bind(this);
        this.handleGoToPageClick = this.handleGoToPageClick.bind(this);
        this.handleChangeLanguageClick = this.handleChangeLanguageClick.bind(this);
    }

    handleLogoutButtonClick(){
      this.props['logoutAction']({ backoffice_session_id: this.props['session'].backoffice_session_id, jwt_token: this.props['session'].jwt_token });
      this.props['history'].push('/login');
    }

    handleUnimplementedMenuButtonClick(){
        this.props['setSubmenuVisibleAction'](false);
    }

    handleGoToPageClick(page){
        this.props['history'].push(page);
        this.props['setSubmenuVisibleAction'](false);
        return page;
    }

    handleChangeLanguageClick(language){
        this.props['setLanguageAction'](language);
    }

    render() {
        return(
        <AppBar position="absolute" color="default" className={classNames(this.props['classes'].appBar, this.props['classes'].appBarShift)}>
            <Toolbar>
                <IconButton className={this.classes.menuButton} color="inherit" aria-label="Menu" onClick={this.props['notifyVisibleSubmenu']}>
                    <HideMenuIcon />
                </IconButton>
                {
                    this.props['menu'] == 'my_account' &&
                    <div>
                        <Button color="inherit" onClick={ () => this.handleGoToPageClick('/authenticated/my-account/my-personal-data')}>
                            <PersonIcon />
                            <FormattedMessage id="My Personal Data" defaultMessage="My Personal Data" />
                        </Button>
                        <Button color="inherit" onClick={ () => this.handleGoToPageClick('/authenticated/my-account/change-password')}>
                            <KeyIcon />
                            <FormattedMessage id="Change Password" defaultMessage="Change Password" />
                        </Button>
                    </div>
                }                
                {
                    this.props['menu'] == 'language' &&
                    <div>
                        <Button color="inherit" onClick={ () => this.handleChangeLanguageClick("en")}>
                            <FormattedMessage id="English" defaultMessage="English" />
                        </Button>
                        <Button color="inherit" onClick={ () => this.handleChangeLanguageClick("en")}>
                            German
                        </Button>
                        <Button color="inherit" onClick={ () => this.handleChangeLanguageClick("en")}>
                            Swedish
                        </Button>
                        <Button color="inherit" onClick={ () => this.handleChangeLanguageClick("en")}>
                            Italian
                        </Button>
                        <Button color="inherit" onClick={ () => this.handleChangeLanguageClick("sr")}>
                            Serbian
                        </Button>
                        <Button color="inherit" onClick={ () => this.handleChangeLanguageClick("en")}>
                            Albanian
                        </Button>
                    </div>
                }
            </Toolbar>
        </AppBar>
        );
    }
}

// CONFIGURE REACT REDUX

const mapStateToProps = state => {
    const { language, language_messages, setLanguageAction, logoutAction } = state.languageState;
    const { session } = state.session;
    const { menu, setMenuAction, setSubmenuVisibleAction } = state.menu;
    return { language, language_messages, setLanguageAction, logoutAction, session, menu, setMenuAction, setSubmenuVisibleAction };
};
  
const mapDispatchToProps = dispatch => (
    bindActionCreators({ setLanguageAction, logoutAction, setSubmenuVisibleAction }, dispatch)
);
  
const hoc = connect(mapStateToProps, mapDispatchToProps)(HeaderSubMenu);

export default withStyles(HeaderSubMenuStyle)(hoc);