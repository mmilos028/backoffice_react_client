import Axios from 'axios';

import * as config from '../../configuration/Config';

const loginUserService = (loginData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Access-Control-Allow-Origin': '*'
        }
    };

    const payload = JSON.stringify({
        username: loginData.username,
        password: loginData.password
    })
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/authenticate/login-backoffice',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            //console.error(error);
            return {
                status: 'NOK',
                message: 'Error in server request'
            };
        });
};

const logoutUserService = (loginData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
            'JWT': loginData.jwt_token
        }
    };

    const payload = JSON.stringify({
        backoffice_session_id: loginData.backoffice_session_id
    });
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/authenticate/logout-backoffice',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {
            window.localStorage.clear();
            return response.data;
        })
        .catch((error) => {
            //console.error(error);
            window.localStorage.clear();
            return {
                status: 'NOK',
                message: 'Error in server request'
            };
        });
};

const pingSessionService = (loginData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
            'JWT': loginData.jwt_token
        }
    };

    const payload = JSON.stringify({
        backoffice_session_id: loginData.backoffice_session_id
    });
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/session-validation/ping-session',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            //console.error(error);
            return {
                status: 'NOK',
                message: 'Error in server request'
            };
        });
};

const validateSessionService = (loginData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
            'JWT': loginData.jwt_token
        }
    };

    const payload = JSON.stringify({
        backoffice_session_id: loginData.backoffice_session_id
    });
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/session/validate-session',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            //console.error(error);
            return {
                status: 'NOK',
                message: 'Error in server request'
            };
        });
};

const getSessionRemainingTimeService = (loginData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
            'JWT': loginData.jwt_token
        }
    };

    const payload = JSON.stringify({
        backoffice_session_id: loginData.backoffice_session_id
    });
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/session/get-session-remaining-time',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            //console.error(error);
            return {
                status: 'NOK',
                message: 'Error in server request'
            };
        });
};

export { 
    loginUserService, 
    logoutUserService, 
    pingSessionService, 
    validateSessionService, 
    getSessionRemainingTimeService 
};