

class NumberHelper {
    static getFormattedDouble(inputValue: number){
        return new Intl.NumberFormat('en-us', {minimumFractionDigits: 2}).format(inputValue);
    }
}
 
export default NumberHelper;