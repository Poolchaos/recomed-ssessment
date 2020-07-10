class Investment {

    static IDENTIFIER = {
        INVESTMENT_MONTH: 'lumpSumInvestmentMonth',
        INVESTMENT_AMOUNT: 'lumpSumInvestmentAmount',
        ORDER_START_MONTH: 'debitOrderStartMonth',
        ORDER_AMOUNT: 'debitOrderAmount'
    };
    static MAX_INVESTMENT = 30000;

    constructor() {
        this.init();
    }

    init() {
        let button = document.querySelector('#calcButton');

        button.onclick = () => {

            const formResponse = this.calculate(
                this.lumpSumInvestmentMonth,
                this.lumpSumInvestmentAmount,
                this.debitOrderStartMonth,
                this.debitOrderAmount
            );
            if (formResponse) {
                document.querySelector('#response').innerHTML = JSON.stringify(formResponse, null, 4);
            }
        }
    }

    get lumpSumInvestmentMonth() {
        const val = this.getInputValue(`#${Investment.IDENTIFIER.INVESTMENT_MONTH}`);
        return parseInt(val);
    }

    get lumpSumInvestmentAmount() {
        const val = this.getInputValue(`#${Investment.IDENTIFIER.INVESTMENT_AMOUNT}`);
        return parseFloat(val);
    }
    
    get debitOrderStartMonth() {
        const val = this.getInputValue(`#${Investment.IDENTIFIER.ORDER_START_MONTH}`);
        return parseInt(val);
    }
    
    get debitOrderAmount() {
        const val = this.getInputValue(`#${Investment.IDENTIFIER.ORDER_AMOUNT}`);
        return parseFloat(val);
    }

    getInputValue(identifier) {
        if (!identifier) return;

        let input = document.querySelector(identifier);
        if (input) return input.value;
    }
    
    calculate(lumpSumInvestmentMonth, lumpSumInvestmentAmount, debitOrderStartMonth, debitOrderAmount) {

        const data = {
            lumpSumInvestmentMonth,
            lumpSumInvestmentAmount,
            debitOrderStartMonth,
            debitOrderAmount
        };

        try {
            this.validityCheck(data);

            const monthsCount = 14 - debitOrderStartMonth;
            let total = lumpSumInvestmentAmount + (monthsCount * debitOrderAmount);
            let earliest = this.getEarliestDebitOrderDate(data);

            return {
                TotalContributions: total,
                EarliestPermissibleDebitOrderStartMonth : earliest
            }
        } catch(e) {
            console.error('Failed to calculate due to cause:', e);
            document.querySelector('#response').innerHTML = e;
        }
    }
    
    getEarliestDebitOrderDate(data) {

        function getMonth(count) {
            let total = data.lumpSumInvestmentAmount + ((15 - count) * data.debitOrderAmount);

            if (total <= Investment.MAX_INVESTMENT && count <= 14) {
                if (count > 12) {
                    return count - 12;
                }
                return count;
            }
            return getMonth(count + 1);
        }
        
        return getMonth(data.debitOrderStartMonth);
    }

    validityCheck(data) {
        this.checkLumpSumInvestmentMonth(data.lumpSumInvestmentMonth);
        this.checkLumpSumInvestmentAmount(data.lumpSumInvestmentAmount);
        this.checkDebitOrderStartMonth(data.lumpSumInvestmentMonth, data.debitOrderStartMonth);
        this.checkDebitOrderAmount(data.debitOrderAmount);
    }

    checkLumpSumInvestmentMonth(value) {
        this.checkIfValueExists('LumpSumInvestmentMonth', value);
        if (typeof value !== 'number') {
            throw new Error('LumpSumInvestmentMonth has to be an int.');
        }
    }

    checkLumpSumInvestmentAmount(value) {
        this.checkIfValueExists('LumpSumInvestmentAmount', value);
        if (typeof value !== 'number') {
            throw new Error('LumpSumInvestmentAmount has to be an int.');
        }
    }

    checkDebitOrderStartMonth(lumpSumInvestmentMonth, value) {
        this.checkIfValueExists('DebitOrderStartMonth', value);
        if (typeof value !== 'number') {
            throw new Error('DebitOrderStartMonth has to be an int.');
        } else if (value <= lumpSumInvestmentMonth) {
            throw new Error('DebitOrderStartMonth has to be a later date than the LumpSumInvestmentMonth.');
        }
    }

    checkDebitOrderAmount(value) {
        this.checkIfValueExists('DebitOrderAmount', value);
        if (typeof value !== 'number') {
            throw new Error('DebitOrderAmount has to be an int.');
        }
    }

    checkIfValueExists(key, value) {
        if (!value) {
            throw new Error(`No value has been entered for ${key}`);
        }
    }
}

new Investment();
