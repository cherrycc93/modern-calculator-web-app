document.addEventListener('DOMContentLoaded', () => {
  const expressionEl = document.querySelector('.display .expression');
  const resultEl = document.querySelector('.display .result');
  const calculatorEl = document.querySelector('.calculator');
  let currentInput = '';
  let previousInput = '';
  let operator = '';
  let expression = '';
  let justComputed = false;

  function updateDisplay() {
    expressionEl.textContent = expression;
    resultEl.textContent = currentInput || '0';
  }

  function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = '';
    expression = '';
    justComputed = false;
    updateDisplay();
  }

  function appendNumber(num) {
    if (justComputed) {
      // start new calculation after computing
      currentInput = num;
      previousInput = '';
      operator = '';
      expression = '';
      justComputed = false;
    } else {
      if (num === '.' && currentInput.includes('.')) return;
      currentInput += num;
    }
    updateDisplay();
  }

  function chooseOperator(op) {
    if (currentInput === '' && op !== '-') return;
    if (previousInput !== '') {
      compute();
    }
    operator = op;
    expression = `${currentInput} ${op}`;
    previousInput = currentInput;
    currentInput = '';
    justComputed = false;
    updateDisplay();
  }

  function compute() {
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(curr)) return;
    let result;
    switch (operator) {
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case 'x':
        result = prev * curr;
        break;
      case '÷':
        result = prev / curr;
        break;
      case '%':
        result = prev % curr;
        break;
      default:
        return;
    }
    currentInput = result.toString();
    expression = `${previousInput} ${operator} ${curr} =`;
    previousInput = '';
    operator = '';
    justComputed = true;
    updateDisplay();

    // glitter effect on compute
    calculatorEl.classList.add('sparkle');
    setTimeout(() => calculatorEl.classList.remove('sparkle'), 1000);
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

  // attach event listeners to buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value') || button.textContent.trim();
      // add glow class
      button.classList.add('clicked');
      setTimeout(() => button.classList.remove('clicked'), 150);

      if (!isNaN(value) || value === '.') {
        appendNumber(value);
      } else {
        switch (value) {
          case 'AC':
            clearAll();
            break;
          case '±':
            negate();
            break;
          case '%':
            percentage();
            break;
          case '=':
            compute();
            break;
          case '+':
          case '-':
          case 'x':
          case '÷':
            chooseOperator(value);
            break;
        }
      }
    });
  });

  // keyboard support
  window.addEventListener('keydown', e => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      appendNumber(e.key);
    } else if (e.key === '+' || e.key === '-') {
      chooseOperator(e.key);
    } else if (e.key === '*' || e.key.toLowerCase() === 'x') {
      chooseOperator('x');
    } else if (e.key === '/' || e.key === '÷') {
      chooseOperator('÷');
    } else if (e.key === 'Enter' || e.key === '=') {
      compute();
    } else if (e.key === 'Escape') {
      clearAll();
    }
  });
});
