document.addEventListener('DOMContentLoaded', () => {
  const expressionEl = document.querySelector('.display .expression');
  const resultEl = document.querySelector('.display .result');
  let currentInput = '';
  let previousInput = '';
  let operator = '';
  let expression = '';
  let memory = 0;

  function updateDisplay() {
    expressionEl.textContent = expression;
    resultEl.textContent = currentInput || '0';
  }

  function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = '';
    expression = '';
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
    expression = `${previousInput} ${operator}`;
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
        result = current === 0 ? 'Error' : prev / current;
        break;
      case '%':
        result = prev % current;
        break;
      default:
        return;
    }
    expression = `${previousInput} ${operator} ${currentInput}`;
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

  // Memory functions
  function memoryClear() {
    memory = 0;
  }

  function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
  }

  function memoryAdd() {
    memory += parseFloat(currentInput || '0');
  }

  function memorySubtract() {
    memory -= parseFloat(currentInput || '0');
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
      } else if (value === 'MC') {
        memoryClear();
      } else if (value === 'MR') {
        memoryRecall();
      } else if (value === 'M+') {
        memoryAdd();
      } else if (value === 'M-') {
        memorySubtract();
      } else {
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
    } else if (['+', '-', '*', 'x', '/', '÷'].includes(e.key)) {
      chooseOperator(e.key);
    } else if (e.key === '%') {
      percentage();
    } else if (e.key === 'Backspace') {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    }
  });

  updateDisplay();
});
