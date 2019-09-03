
import {
    LIST_REPORT_ACTION,
    LIST_REPORT_PENDING_STATUS_ACTION,
    LIST_REPORT_FULFILLED_STATUS_ACTION,
    LIST_REPORT_REJECTED_STATUS_ACTION

} from '../../actions/report/ReportActions';

const initialState = {
    list_report: [],
    list_report_pending_status: false,
    list_report_fulfilled_status: false,
    list_report_rejected_status: false,
}

let ReportReducer = (state = initialState, action) => {
    switch(action.type) {
        case LIST_REPORT_ACTION:
            return {
                ...state,
                list_report_pending_status: false,
                list_report_fulfilled_status: true,
                list_report_rejected_status: false,
            }
        case LIST_REPORT_PENDING_STATUS_ACTION:
            return {
                ...state,
                list_report: [],
                list_report_pending_status: true,
                list_report_fulfilled_status: false,
                list_report_rejected_status: false,
            };        
        case LIST_REPORT_FULFILLED_STATUS_ACTION: 
            return {
                ...state, 
                list_report: action.payload,
                list_report_pending_status: false,
                list_report_fulfilled_status: true,
                list_report_rejected_status: false,
            };
        case LIST_REPORT_REJECTED_STATUS_ACTION: 
            return {
                ...state, 
                list_report: [],
                list_report_pending_status: false,
                list_report_fulfilled_status: false,
                list_report_rejected_status: true
            };     
        default: 
            return state;    
    }
};

export { ReportReducer };