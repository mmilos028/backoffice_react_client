
import {
    LOGIN,
    LOGOUT,
    SAVE_LOGIN
} from '../../actions/session/SessionActions';

import { DEBUG_CONSOLE } from "../../../configuration/Config";

const initialState = {
    session: {},
    physical_address: {}
}

let SessionReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOGIN: 
            return {
                ...state, 
                session: action.payload,
            };
        case SAVE_LOGIN:
            return {
                ...state,
                session: action.payload
            };  
        case LOGOUT:
            if(DEBUG_CONSOLE){
                console.log(state);
            }
            return {
                ...state,
                session: {}
            };
        default: 
            return state;    
    }
};

export { SessionReducer };