
import { loginUserService, logoutUserService, 
    pingSessionService, validateSessionService, getSessionRemainingTimeService } from '../../services/SessionService';

export const LOGIN = 'LOGIN';
export const SAVE_LOGIN = 'SAVE_LOGIN';
export const LOGOUT = 'LOGOUT';
export const PING_SESSION = 'PING_SESSION';
export const VALIDATE_SESSION = 'VALIDATE_SESSION';
export const GET_SESSION_REMAINING_TIME = 'GET_SESSION_REMAINING_TIME';

const loginAction = (loginData) => ({
    type: LOGIN,
    payload: loginUserService(loginData)
});

const saveLoginAction = (loginData) => ({
    type: SAVE_LOGIN,
    payload: loginData
})

const logoutAction = (logoutData) => ({
    type: LOGOUT,
    payload: logoutUserService(logoutData)
});

const pingSessionAction = (loginData) => ({
    type: PING_SESSION,
    payload: pingSessionService(loginData)
});

const validateSessionAction = (loginData) => ({
    type: VALIDATE_SESSION,
    payload: validateSessionService(loginData)
});

const getSessionRemainingTimeAction = (loginData) => ({
    type: GET_SESSION_REMAINING_TIME,
    payload: getSessionRemainingTimeService(loginData)
});

export { loginAction, saveLoginAction, logoutAction, pingSessionAction, validateSessionAction, getSessionRemainingTimeAction };