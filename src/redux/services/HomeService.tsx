import Axios from 'axios';

import * as config from '../../configuration/Config';

const personalInformationForHomePageService = (loginData) => {
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
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/home/personal-information',
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
    personalInformationForHomePageService
}