import Axios from 'axios';

import * as config from '../../../../configuration/Config';

const searchListVouchersService = (reportData) => {
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
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/search-prepaid-cards',
        payload,
        axiosConfig
    );

    return request
        .then((response) => {            
            return response.data.report;
        })
        .catch((error) => {
            console.error(error);
           return [];
        });
};

const listAvailableAmountsService = (reportData) => {
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
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/list-available-amounts',
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

const listAvailableCurrencyService = (reportData) => {
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
 
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/list-available-currency',
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

const listAvailableStatusesService = (reportData) => {
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
  
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/list-available-statuses',
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

const listAffiliateCreatorsService = (reportData) => {
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
  
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/list-affiliate-creators',
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

const listAffiliateOwnersService = (reportData) => {
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
  
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/list-affiliate-owners',
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

const listUsedByPlayerService = (reportData) => {
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
  
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/list-used-by-player',
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

const listAffiliatesForCurrencyService = (reportData) => {
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
  
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/list-affiliates-for-currency',
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

const createVoucherCardService = (reportData) => {
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
  
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/create-voucher-card',
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

const editVoucherCardService = (reportData) => {
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
  
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/edit-voucher-card',
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

const listVouchersService = (reportData) => {
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
  
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/list-prepaid-cards',
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

const createMemberCardService = (reportData) => {
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
  
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/create-member-card',
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

const editMemberCardService = (reportData) => {
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
  
    const request = Axios.post(config.REST_SERVICE_BASE_URL + '/administration/vouchers/edit-member-card',
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
    searchListVouchersService,
    listAvailableAmountsService,
    listAvailableCurrencyService,
    listAvailableStatusesService,
    listAffiliateCreatorsService,
    listAffiliateOwnersService,
    listUsedByPlayerService,
    listAffiliatesForCurrencyService,
    createVoucherCardService,
    editVoucherCardService,
    listVouchersService,
    createMemberCardService,
    editMemberCardService
};