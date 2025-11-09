document.addEventListener('DOMContentLoaded', () => {
  const expressionEl = document.querySelector('.display .expression');
  const resultEl = document.querySelector('.display .result');
  const calculatorEl = document.querySelector('.calculator');
  let currentInput = '';
  let previousInput = '';
  let operator = '';
  let expression = '';
  let justComputed = false;  // tracks if last action was "="

  function updateDisplay() {
    expressionEl.textContent = expression;
    resultEl.textContent = currentInput || '0';
  }

  function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = '';
    expression = '';
    justComputed = false;  // reset this too
    updateDisplay();
  }

  function appendNumber(num) {
    // If we just finished a computation and user starts typing a number,
    // start a brand new calculation.
    if (justComputed) {
      currentInput = '';
      previousInput = '';
      operator = '';
      expression = '';
      justComputed = false;
    }

    if (num === '.' && currentInput.includes('.')) return;
    currentInput += num;
    updateDisplay();
  }

  function chooseOperator(op) {
    justComputed = false;  // we're continuing from the last result

    if (currentInput === '' && previousInput === '') return;
    if (previousInput !== '') {
      compute();
    }
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    expression = `${previousInput} ${operator}`;
    updateDisplay();
  }

  function compute() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case 'x':
      case '×':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        computation = prev / current;
        break;
      case '%':
        computation = prev % current;
        break;
      default:
        return;
    }

    currentInput = computation.toString();
    expression = `${prev} ${operator} ${current} =`;
    previousInput = '';
    operator = '';
    updateDisplay();

    justComputed = true;  // mark that we just hit "="

    // glitter animation
    calculatorEl.classList.add('sparkle');
    setTimeout(() => {
      calculatorEl.classList.remove('sparkle');
    }, 1000);
  } // ← this closing brace was missing

  function negate() {
    if (currentInput === '') return;
    if (currentInput.startsWith('-')) {
      currentInput = currentInput.slice(1);
    } else {
      currentInput = '-' + currentInput;
    }
    updateDisplay();
  }

  function percentage() {
    if (currentInput === '') return;
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
  }

  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-value');
      switch (value) {
        case 'AC':
          clearAll();
          break;
        case 'negate':
          negate();
          break;
        case '%':
          percentage();
          break;
        case '+':
        case '-':
        case 'x':
        case '×':
        case '÷':
        case '/':
          chooseOperator(value);
          break;
        case '=':
          compute();
          break;
        default:
          appendNumber(value);
      }

      // glow + halo sparkle effect
      btn.classList.add('clicked');
      setTimeout(() => {
        btn.classList.remove('clicked');
      }, 600); // matches CSS @keyframes sparkle-fade (0.6s)
    });
  });

  // keyboard support
  document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      appendNumber(e.key);
    }
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
      let op = e.key;
      if (op === '*') op = 'x';
      if (op === '/') op = '÷';
      chooseOperator(op);
    }
    if (e.key === 'Enter' || e.key === '=') {
      compute();
    }
    if (e.key === 'Escape') {
      clearAll();
    }
    if (e.key === 'Backspace') {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    }
  });
});
