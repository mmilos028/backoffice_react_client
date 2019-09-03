// IMPORT PACKAGE REFERENCES

import { createStore, applyMiddleware } from 'redux';
import { compose } from 'redux';

// IMPORT MIDDLEWARE

//import thunk from 'redux-thunk';
import { default as thunk } from 'redux-thunk';
import promise from 'redux-promise-middleware';

// IMPORT REDUCERS

import { AppReducer } from '../reducers/AppReducer';

// CONFIGURE STORE
 
let appState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {};

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
let appStore = createStore(AppReducer, appState, composeEnhancers(
    applyMiddleware(thunk, promise)
));

appStore.subscribe(()=>{
    localStorage.setItem('reduxState', JSON.stringify(appStore.getState()));
});

export const createAppStore = () => {
    return appStore;
};