// script.js
// Modern calculator with display history and Barbie pink theme
document.addEventListener('DOMContentLoaded', () => {
    const historyEl = document.querySelector('.display .history');
    const currentEl = document.querySelector('.display .current');
    let currentInput = '';
    let previousInput = '';
    let operator = '';
    function updateDisplay() {
        historyEl.textContent = previousInput ? `${previousInput} ${operator}` : '';
        currentEl.textContent = currentInput || '0';
    }
    function clearAll() {
        currentInput = '';
        previousInput = '';
        operator = '';
        updateDisplay();
    }
    function appendNumber(num) {
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num;
        updateDisplay();
    }
    function chooseOperator(op) {
        if (currentInput === '' && previousInput === '') return;
        if (previousInput !== '') {
            compute();
        }
        operator = op;
        previousInput = currentInput;
        currentInput = '';
        updateDisplay();
    }
    function compute() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        if (isNaN(prev) || isNaN(current)) return;
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case 'x':
            case '*':
                result = prev * current;
                break;
            case '/':
            case '÷':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = prev / current;
                }
                break;
            case '%':
                result = prev % current;
                break;
            default:
                return;
        }
        currentInput = result.toString();
        previousInput = '';
        operator = '';
        updateDisplay();
    }
    function negate() {
        if (currentInput === '') return;
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }
    function percentage() {
        if (currentInput === '') return;
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
    }
    // Attach click events
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.getAttribute('data-value');
            if (!value) return;
            if ((value >= '0' && value <= '9') || value === '.') {
                appendNumber(value);
            } else if (value === 'AC') {
                clearAll();
            } else if (value === 'negate') {
                negate();
            } else if (value === '%') {
                percentage();
            } else if (value === '=') {
                compute();
            } else {
                // operator
                chooseOperator(value);
            }
        });
    });
    // Keyboard support
    document.addEventListener('keydown', e => {
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            appendNumber(e.key);
        } else if (e.key === 'Escape') {
            clearAll();
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            compute();
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === 'x' || e.key === '/' || e.key === '÷') {
            chooseOperator(e.key);
        } else if (e.key === '%') {
            percentage();
        } else if (e.key === 'Backspace') {
            // remove last char
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
        }
    });
    updateDisplay();
});
