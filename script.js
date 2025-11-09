// script.js
// Calculator functionality

window.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    let current = '';
    let previous = '';
    let operator = '';

    function updateDisplay() {
        // show 0 if nothing
        display.value = current || '0';
    }

    function clearAll() {
        current = '';
        previous = '';
        operator = '';
        updateDisplay();
    }

    function appendNumber(num) {
        // avoid multiple decimals
        if (num === '.' && current.includes('.')) return;
        current += num;
        updateDisplay();
    }

    function chooseOperator(op) {
        if (current === '') return;
        if (previous !== '') compute();
        operator = op;
        previous = current;
        current = '';
    }

    function compute() {
        const prev = parseFloat(previous);
        const curr = parseFloat(current);
        if (isNaN(prev) || isNaN(curr)) return;
        let result;
        switch (operator) {
            case '+':
                result = prev + curr;
                break;
            case '-':
                result = prev - curr;
                break;
            case '*':
                result = prev * curr;
                break;
            case '/':
                if (curr === 0) {
                    result = 'Error';
                } else {
                    result = prev / curr;
                }
                break;
            default:
                return;
        }
        current = result.toString();
        operator = '';
        previous = '';
        updateDisplay();
    }

    document.querySelectorAll('.buttons button').forEach(btn => {
        const value = btn.getAttribute('data-value');
        btn.addEventListener('click', () => {
            if (!value) return;
            if (value >= '0' && value <= '9' || value === '.') {
                appendNumber(value);
            } else if (value === 'C') {
                clearAll();
            } else if (value === '=') {
                compute();
            } else {
                chooseOperator(value);
            }
        });
    });

    clearAll();
});
