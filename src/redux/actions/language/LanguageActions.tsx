
export const INIT_LANGUAGE = 'INIT_LANGUAGE';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_LANGUAGE_MESSAGES = 'SET_LANGUAGE_MESSAGES';


// ACTION GENERATORS

const initLanguageAction = (language) => ({
    type: INIT_LANGUAGE,
    payload: language
});

const setLanguageAction = (language) => ({
    type: SET_LANGUAGE,
    payload: language
});

const setLanguageMessagesAction = (selectedMessages) => ({
    type: SET_LANGUAGE_MESSAGES,
    payload: selectedMessages
});


// EXPORT ACTIONS

export { initLanguageAction, setLanguageAction, setLanguageMessagesAction };