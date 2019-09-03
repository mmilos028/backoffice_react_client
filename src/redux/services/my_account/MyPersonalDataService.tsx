import Axios from 'axios';

import * as config from '../../../configuration/Config';

const personalInformationService = (loginData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Access-Control-Allow-Origin': '*',      
            'JWT': loginData.jwt_token
        }
    };

    const payload = JSON.stringify({
        backoffice_session_id: loginData.backoffice_session_id,
        affiliate_id: loginData.affiliate_id
    });
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/my-account/personal-information',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
           return [];
        });
};

const updatePersonalInformationService = (loginData, personalData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Access-Control-Allow-Origin': '*',
            'JWT': loginData.jwt_token
        }
    };

    const payload = JSON.stringify(
        {        
            backoffice_session_id: loginData.backoffice_session_id,
            email: personalData.email,
            country_id: personalData.country_id,
            zip: personalData.zip,
            phone: personalData.phone,
            address: personalData.address,
            birthday: personalData.birthday,
            first_name: personalData.first_name,
            last_name: personalData.last_name,
            city: personalData.city,
            affiliate_id: personalData.affiliate_id
        }
    );
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/my-account/save-personal-information',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
           return [];
        });
};

const changePasswordService = (loginData, changePasswordData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Access-Control-Allow-Origin': '*',
            'JWT': loginData.jwt_token
        }
    };

    const payload = JSON.stringify(
        {
            body: {
                backoffice_session_id: loginData.backoffice_session_id,
                username: changePasswordData.username,
                user_id: changePasswordData.user_id,
                password: changePasswordData.password,
            }
        }
    );
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/my-account/change-password',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
           return [];
        });
};

const listCountriesService = (loginData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Access-Control-Allow-Origin': '*',
            'JWT': loginData.jwt_token
        }
    };

    const payload = JSON.stringify({
        backoffice_session_id: loginData.backoffice_session_id
    });
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/index/list-countries',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
           return [];
        });
};

export { 
    personalInformationService,
    updatePersonalInformationService,
    listCountriesService,
    changePasswordService
}