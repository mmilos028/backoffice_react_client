export const LIST_REPORT_ACTION = 'LIST_REPORT_ACTION';
export const LIST_REPORT_PENDING_STATUS_ACTION = 'LIST_REPORT_PENDING_STATUS_ACTION';
export const LIST_REPORT_FULFILLED_STATUS_ACTION = 'LIST_REPORT_FULFILLED_STATUS_ACTION';
export const LIST_REPORT_REJECTED_STATUS_ACTION = 'LIST_REPORT_REJECTED_STATUS_ACTION';

//list players and terminals for credit transfer
const listReportAction = (loginData, reportServiceFn) => (
    {
        type: LIST_REPORT_ACTION,
        payload: reportServiceFn(loginData)
    }
);

const listReportPendingStatusAction = (loginData) => (
    {
        type: LIST_REPORT_PENDING_STATUS_ACTION
    }
);

const listReportFulfilledStatusAction = (reportData) => (
    {
        type: LIST_REPORT_FULFILLED_STATUS_ACTION,
        payload: reportData
    }
);

const listReportRejectedStatusAction = (loginData) => (
    {
        type: LIST_REPORT_REJECTED_STATUS_ACTION
    }
);

export { 
    listReportAction, 
    listReportPendingStatusAction, 
    listReportFulfilledStatusAction, 
    listReportRejectedStatusAction
};