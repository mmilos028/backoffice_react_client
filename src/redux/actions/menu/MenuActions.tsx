
export const INIT_MENU = 'INIT_MENU';
export const SET_MENU = 'SET_MENU';
export const SET_SUBMENU_VISIBLE = 'SET_SUBMENU_VISIBLE';

// ACTION GENERATORS

const initMenuAction = (menu) => ({
    type: INIT_MENU,
    payload: menu
});

const setMenuAction = (menu) => ({
    type: SET_MENU,
    payload: menu
});

const setSubmenuVisibleAction = (submenu_visibility) => ({
    type: SET_SUBMENU_VISIBLE,
    payload: submenu_visibility
})

// EXPORT ACTIONS

export { initMenuAction, setMenuAction, setSubmenuVisibleAction };