import React from "react";
import classNames from "classnames";
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// core components
//import { FormattedMessage } from 'react-intl';
import { SidebarStyle } from "./SidebarStyle";
import SidebarMainLinks from './SidebarMainLinks';
import SidebarSecondaryLinks from './SidebarSecondaryLinks';

class Sidebar extends React.Component {

    static propTypes = {
        openSidebar: PropTypes.bool.isRequired,
        notifySidebarState: PropTypes.func.isRequired
    }

    constructor(props){

      super(props);

      this.state = {
        openCodebook: false,
        openInbox: false,
        openLanguage: false
      };
  
      this.activeRoute = this.activeRoute.bind(this);

      this.handleLogoutButtonClick = this.handleLogoutButtonClick.bind(this);
        
      this.handleInboxClick = this.handleInboxClick.bind(this);
      this.handleLanguageClick = this.handleLanguageClick.bind(this);
  
      this.handleLanguageEnglishClick = this.handleLanguageEnglishClick.bind(this);
      this.handleLanguageSerbianClick = this.handleLanguageSerbianClick.bind(this);        

      this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
      this.handleDrawerClose = this.handleDrawerClose.bind(this);
    }
    
    // verifies if routeName is the one active (in browser input)
    activeRoute(routeName) {
      return this.props['location'].pathname.indexOf(routeName) > -1 ? true : false;
    }
  
    handleLogoutButtonClick(){
      //this.props.logoutAction({session_id: this.props.session.session_id});
      this.props['history'].push('/login');     
    }
  
    handleInboxClick() {
      this.setState(state => ({ openInbox: !state['openInbox'] }));
    }  
  
    handleLanguageClick() {
      this.setState(state => ({ openLanguage: !state['openLanguage'] }));
    }  
  
    handleLanguageEnglishClick() {
      //this.props.setLanguageAction('en');
    } 
  
    handleLanguageSerbianClick() {
      //this.props.setLanguageAction('sr');
    }

    handleDrawerOpen = () => {
        this.setState({ openSidebar: true });
    };
    
    handleDrawerClose = () => {
        this.setState({ openSidebar: false });
    };
  
    render(){  
        return (
            <Drawer
            variant="permanent"
            classes={{
                paper: classNames(this.props['classes'].drawerPaper, !this.props['openSidebar'] && this.props['classes'].drawerPaperClose),
            }}
            open={this.props['openSidebar']}
            >
            <div className={this.props['classes'].toolbarIcon}>            
                <IconButton onClick={this.props['notifySidebarState']}>                
                <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
              <SidebarMainLinks />
            </List>
            <Divider />
            <List>
              <SidebarSecondaryLinks />
            </List>
            </Drawer>
        )
    }
  }

  export default withStyles(SidebarStyle)(Sidebar);