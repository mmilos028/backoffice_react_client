

class DateTimeHelper {
    static getFirstDayInMonth(){
        let currentDate = new Date();
        let date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        var monthNames = ["Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct", "Nov",
            "Dec"
        ];

        var monthDay = ("0" + date.getDate()).slice(-2);
        var year = date.getFullYear();
        var monthName = monthNames[date.getMonth()];  
        
        return (monthDay + "-" + monthName + "-" + year);
    }

    static getCurrentDayInMonth(){
        let date = new Date();

        var monthNames = ["Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct", "Nov",
            "Dec"
        ];

        var monthDay = ("0" + date.getDate()).slice(-2);
        var year = date.getFullYear();
        var monthName = monthNames[date.getMonth()];  
        
        return (monthDay + "-" + monthName + "-" + year);
    }

    static getFormattedDate(date){
        if(date === null)
        {
            return null;
        }
        var monthNames = ["Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct", "Nov",
            "Dec"
        ];

        var monthDay = ("0" + date.getDate()).slice(-2);
        var year = date.getFullYear();
        var monthName = monthNames[date.getMonth()];  
        
        return (monthDay + "-" + monthName + "-" + year);
    }

    static getFormattedDateFromDatePickerVouchers(date){
        if(date === null)
        {
            return null;
        }

        var monthDay = ("0" + date.getDate()).slice(-2);
        var year = date.getFullYear();
        var monthName = (date.getMonth() < 9) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1); //monthNames[date.getMonth()];  
        
        return (monthDay + "." + monthName + "." + year);
    }
}

export default DateTimeHelper;