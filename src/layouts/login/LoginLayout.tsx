/* eslint-disable */
import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route, Redirect } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import loginRoutes from "../../routes/Login";
import { IntlProvider, addLocaleData } from 'react-intl';
import en from "react-intl/locale-data/en";
import sr from "react-intl/locale-data/sr";
import { MuiThemeProvider, withTheme } from '@material-ui/core/styles';
import Theme from '../../theme/Theme';
import { initLanguageAction } from '../../redux/actions/language/LanguageActions';

const switchRoutes = (
  <Switch>
    {loginRoutes.map((prop, key) => {
      if (prop['redirect'])
        return <Redirect from={prop.path} to={prop['to']} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

addLocaleData([ ...en, ...sr ]);
const p_language = 'en';

class LoginLayout extends React.Component {

  static propTypes = {    
    initLanguageAction: PropTypes.func.isRequired,
  }; 

  constructor(props) {
    super(props);
    this.resizeFunction = this.resizeFunction.bind(this);

    this.props['initLanguageAction'](p_language);
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
  }
  
  render() {   
    return (
      <MuiThemeProvider theme={Theme}>
        <IntlProvider locale={this.props['language']} messages={this.props['language_messages']}>
          <div>
              {/* On the /maps route we want the map to be on full screen - 
              this is not possible if the content and conatiner classes are present 
              because they have some paddings which would make the map smaller */}
              {this.getRoute() ? (
                <div>
                  <div>{switchRoutes}</div>
                </div>
              ) : (
                <div>{switchRoutes}</div>
              )}
          </div>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

// CONFIGURE REACT REDUX

const mapStateToProps = state => {

  const { language, language_messages, initLanguageAction } = state.languageState;

  return { language, language_messages, initLanguageAction };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ initLanguageAction }, dispatch)
);

const hoc = connect(mapStateToProps, mapDispatchToProps)(LoginLayout);

export default (withTheme()(hoc));