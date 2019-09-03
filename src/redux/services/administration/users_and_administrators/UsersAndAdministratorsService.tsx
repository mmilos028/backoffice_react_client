import Axios from 'axios';

import * as config from '../../../../configuration/Config';

const listAllRolesService = (reportData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Access-Control-Allow-Origin': '*',      
            'JWT': reportData.jwt_token
        }
    };

    let payloadData = JSON.parse(JSON.stringify(reportData));
    delete payloadData['jwt_token'];

    const payload = JSON.stringify({
        ...payloadData
    });
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/users-and-administrators/list-all-roles',
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

const listAffiliatesForNewUserService = (reportData) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Access-Control-Allow-Origin': '*',      
            'JWT': reportData.jwt_token
        }
    };

    let payloadData = JSON.parse(JSON.stringify(reportData));
    delete payloadData['jwt_token'];

    const payload = JSON.stringify({
        ...payloadData
    });
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/users-and-administrators/list-affiliates-for-new-user',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {
            let newReport = [];
            for(let report of response.data.report){
                newReport.push({
                    affiliate_id: report.subject_id_to,
                    affiliate_name: report.name_to
                });
            };
            response.data.report = newReport;
            return response.data;
        })
        .catch((error) => {
            console.error(error);
           return [];
        });
};


export { 
    listAllRolesService,
    listAffiliatesForNewUserService
};