import {
    INIT_MENU,
    SET_MENU,
    SET_SUBMENU_VISIBLE
} from '../../actions/menu/MenuActions';

// INITIALIZE STATE

const initialState = {
    menu: 'my_account',
    submenu_visibility: true
};

// REDUCER

export const MenuReducer = (state = initialState, action) => {
    switch(action.type) {
        case INIT_MENU:
            return {
                ...state,
                menu: action.payload || initialState.menu
            };
        case SET_MENU:
            return {
                ...state,
                menu: action.payload
            };
        case SET_SUBMENU_VISIBLE:
            return {
                ...state,
                submenu_visibility: action.payload
            };    
        default:
            return state;
    }
};