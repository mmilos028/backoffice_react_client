import {
    INIT_LANGUAGE,
    SET_LANGUAGE,
    SET_LANGUAGE_MESSAGES
} from '../../actions/language/LanguageActions';

import localeData from '../../../language/language.json';
// INITIALIZE STATE

const initialState = {
    language: 'en',
    language_messages: localeData['en']
};

// REDUCER

export const LanguageReducer = (state = initialState, action) => {
    switch(action.type) {
        case INIT_LANGUAGE:
            return {
                ...state,
                language: action.payload || initialState.language,
                language_messages: localeData[action.payload] || initialState.language_messages
            };
        case SET_LANGUAGE:
            return {
                ...state,
                language: action.payload,
                language_messages: localeData[action.payload]
            };
        case SET_LANGUAGE_MESSAGES:
            return {
                ...state,
                language_messages: action.payload
            }        
        default:
            return state;
    }
};