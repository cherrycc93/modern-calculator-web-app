document.addEventListener('DOMContentLoaded', () => {
  const expressionEl = document.querySelector('.display .expression');
  const resultEl = document.querySelector('.display .result');
  const calculatorEl = document.querySelector('.calculator');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const soundToggleBtn = document.getElementById('sound-toggle');

  let currentInput = '';
  let previousInput = '';
  let operator = '';
  let expression = '';
  let justComputed = false;
  let isNight = false;
  let soundOn = true;

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
    if (currentInput === '' && op !== '−') return;
    if (previousInput !== '') {
      compute();
    }
    operator = op;
    previousInput = currentInput;
    expression = `${previousInput} ${operator}`;
    currentInput = '';
    updateDisplay();
  }

  function compute() {
    if (operator === '' || currentInput === '' || previousInput === '') return;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    let result;
    switch (operator) {
      case '+':
        result = prev + curr;
        break;
      case '−':
        result = prev - curr;
        break;
      case '×':
        result = prev * curr;
        break;
      case '÷':
        result = prev / curr;
        break;
      default:
        return;
    }
    expression = `${previousInput} ${operator} ${currentInput} =`;
    currentInput = result.toString();
    previousInput = '';
    operator = '';
    justComputed = true;
    updateDisplay();
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

  function playClickSound() {
    if (!soundOn) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      isNight = !isNight;
      if (isNight) {
        calculatorEl.classList.add('night');
        calculatorEl.classList.remove('day');
        document.body.classList.add('night');
        document.body.classList.remove('day');
        themeToggleBtn.textContent = '🌞';
      } else {
        calculatorEl.classList.remove('night');
        calculatorEl.classList.add('day');
        document.body.classList.remove('night');
        document.body.classList.add('day');
        themeToggleBtn.textContent = '🌙';
      }
    });
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      soundToggleBtn.textContent = soundOn ? '🔊' : '🔇';
    });
  }

  const buttons = document.querySelectorAll('.keypad button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      btn.classList.add('clicked');
      setTimeout(() => btn.classList.remove('clicked'), 150);
      const value = btn.getAttribute('data-value');
      if (!isNaN(value) || value === '.') {
        appendNumber(value);
      } else if (value === 'AC') {
        clearAll();
      } else if (value === '=') {
        compute();
      } else if (value === '±') {
        negate();
      } else if (value === '%') {
        percentage();
      } else {
        chooseOperator(value);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (!isNaN(key) || key === '.') {
      appendNumber(key);
    } else if (['+', '-', '/', '*', 'x', '÷', '×', '−'].includes(key)) {
      const opMap = { '*': '×', '/': '÷', '-': '−' };
      chooseOperator(opMap[key] || key);
    } else if (key === 'Enter' || key === '=') {
      compute();
    } else if (key === 'Escape') {
      clearAll();
    } else if (key === 'Backspace') {
      if (justComputed) {
        clearAll();
      } else {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
      }
    } else if (key === '%') {
      percentage();
    }
  });
});
