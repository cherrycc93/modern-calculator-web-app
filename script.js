document.addEventListener('DOMContentLoaded', () => {
  const expressionEl = document.querySelector('.display .expression');
  const resultEl = document.querySelector('.display .result');
  const calculatorEl = document.querySelector('.calculator');
  const soundToggleBtn = document.getElementById('sound-toggle');
  const modeToggleBtn = document.getElementById('mode-toggle');
  const themeButtons = document.querySelectorAll('.theme-btn');
  const historyTabBtn = document.getElementById('history-tab-btn');
  const historyPanel = document.getElementById('history-panel');
  const historyClose = document.getElementById('history-close');
  const historyOverlay = document.getElementById('history-overlay');
  const historyList = document.getElementById('history-list');
  const historyClear = document.getElementById('history-clear');

  let currentInput = '';
  let previousInput = '';
  let operator = '';
  let expression = '';
  let justComputed = false;
  let isNight = false;
  let soundOn = true;
  let currentTheme = 'theme-barbie-day';
  let calculationHistory = [];
  let advancedMode = false;
  let memory = 0;

  function updateDisplay() {
    expressionEl.textContent = expression;
    resultEl.textContent = currentInput || '0';
  }

  function loadHistory() {
    const saved = localStorage.getItem('glamcalc-history');
    calculationHistory = saved ? JSON.parse(saved) : [];
  }

  function saveHistory() {
    localStorage.setItem('glamcalc-history', JSON.stringify(calculationHistory));
  }

  function addToHistory(expr, result) {
    calculationHistory.unshift({ expression: expr, result: result });
    if (calculationHistory.length > 50) {
      calculationHistory.pop();
    }
    saveHistory();
    updateHistoryDisplay();
  }

  function updateHistoryDisplay() {
    if (calculationHistory.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
      return;
    }
    
    historyList.innerHTML = calculationHistory.map((item, index) => `
      <div class="history-item" data-index="${index}" data-result="${item.result}">
        <div class="history-item-expression">${item.expression}</div>
        <div class="history-item-result">= ${item.result}</div>
      </div>
    `).join('');
    
    // Add click handlers to history items
    document.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const result = item.getAttribute('data-result');
        // Clear everything and just load the result
        currentInput = result;
        previousInput = '';
        operator = '';
        expression = '';
        justComputed = false;
        updateDisplay();
        toggleHistory();
      });
    });
  }

  function toggleHistory() {
    historyPanel.classList.toggle('open');
    historyOverlay.classList.toggle('open');
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
    if (currentInput === '' && previousInput === '' && op !== '−') return;
    if (previousInput !== '') {
      compute();
    }
    operator = op;
    previousInput = currentInput;
    expression = `${previousInput} ${operator}`;
    currentInput = '';
    justComputed = false;
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
    
    // Store full calculation for history
    const fullExpression = `${previousInput} ${operator} ${curr}`;
    expression = `${previousInput} ${operator} ${currentInput} =`;
    currentInput = result.toString();
    
    // Add to history with correct expression
    addToHistory(fullExpression, result.toString());
    
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
    justComputed = false;
    updateDisplay();
  }

  function percentage() {
    if (currentInput === '') return;
    currentInput = (parseFloat(currentInput) / 100).toString();
    justComputed = false;
    updateDisplay();
  }

  function handleAdvancedFunction(func) {
    if (currentInput === '') return;
    const num = parseFloat(currentInput);
    let result;
    
    switch(func) {
      case 'sin':
        result = Math.sin(num * Math.PI / 180); // Convert degrees to radians
        break;
      case 'cos':
        result = Math.cos(num * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(num * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(num);
        break;
      case 'ln':
        result = Math.log(num);
        break;
      case 'sqrt':
        result = Math.sqrt(num);
        break;
      case 'square':
        result = num * num;
        break;
      case 'reciprocal':
        result = 1 / num;
        break;
      default:
        return;
    }
    
    currentInput = result.toString();
    justComputed = false;
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

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      soundToggleBtn.textContent = soundOn ? '🔊' : '🔇';
    });
  }

  // History panel events
  loadHistory();
  updateHistoryDisplay();

  if (historyTabBtn) {
    historyTabBtn.addEventListener('click', toggleHistory);
  }

  if (historyClose) {
    historyClose.addEventListener('click', toggleHistory);
  }

  if (historyOverlay) {
    historyOverlay.addEventListener('click', toggleHistory);
  }

  if (historyClear) {
    historyClear.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all history?')) {
        calculationHistory = [];
        saveHistory();
        updateHistoryDisplay();
      }
    });
  }

  // Theme selector with circular buttons
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newTheme = btn.getAttribute('data-theme');
      
      // Remove active class from all theme buttons
      themeButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Remove all theme classes
      calculatorEl.classList.remove('theme-barbie-day', 'theme-midnight', 'theme-rose-gold', 'theme-galaxy');
      document.body.classList.remove('theme-barbie-day', 'theme-midnight', 'theme-rose-gold', 'theme-galaxy');
      
      // Add new theme class
      calculatorEl.classList.add(newTheme);
      document.body.classList.add(newTheme);
      currentTheme = newTheme;
      
      // Save theme preference
      localStorage.setItem('glamcalc-theme', newTheme);
    });
  });

  // Load saved theme preference
  const savedTheme = localStorage.getItem('glamcalc-theme') || 'theme-barbie-day';
  const savedThemeBtn = document.querySelector(`[data-theme="${savedTheme}"]`);
  if (savedThemeBtn) {
    savedThemeBtn.classList.add('active');
  }
  calculatorEl.classList.add(savedTheme);
  document.body.classList.add(savedTheme);
  currentTheme = savedTheme;

  // Mode toggle functionality
  function toggleMode() {
    advancedMode = !advancedMode;
    if (advancedMode) {
      calculatorEl.classList.add('advanced-mode');
      modeToggleBtn.style.opacity = '1';
    } else {
      calculatorEl.classList.remove('advanced-mode');
      modeToggleBtn.style.opacity = '0.6';
    }
    localStorage.setItem('glamcalc-mode', advancedMode ? 'advanced' : 'simple');
  }

  // Load saved mode preference
  const savedMode = localStorage.getItem('glamcalc-mode');
  if (savedMode === 'advanced') {
    toggleMode();
  } else {
    modeToggleBtn.style.opacity = '0.6';
  }

  // Mode toggle button event listener
  modeToggleBtn.addEventListener('click', toggleMode);

  const buttons = document.querySelectorAll('.keypad button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'history-tab-btn' || btn.id === 'mode-toggle') return; // Skip special buttons
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
      } else if (value === 'sin') {
        handleAdvancedFunction('sin');
      } else if (value === 'cos') {
        handleAdvancedFunction('cos');
      } else if (value === 'tan') {
        handleAdvancedFunction('tan');
      } else if (value === 'log') {
        handleAdvancedFunction('log');
      } else if (value === 'ln') {
        handleAdvancedFunction('ln');
      } else if (value === '√') {
        handleAdvancedFunction('sqrt');
      } else if (value === 'x²') {
        handleAdvancedFunction('square');
      } else if (value === '1/x') {
        handleAdvancedFunction('reciprocal');
      } else if (value === 'π') {
        appendNumber(Math.PI.toString());
      } else if (value === 'e') {
        appendNumber(Math.E.toString());
      } else if (value === 'MC') {
        memory = 0;
      } else if (value === 'MR') {
        currentInput = memory.toString();
        updateDisplay();
      } else if (value === 'M+') {
        memory += parseFloat(currentInput) || 0;
      } else if (value === 'M−') {
        memory -= parseFloat(currentInput) || 0;
      } else if (value === '(' || value === ')') {
        appendNumber(value);
      } else {
        chooseOperator(value);
      }
    });
  });

  // Add event listeners for advanced column buttons
  const advancedBtns = document.querySelectorAll('.advanced-column .memory-btn');
  advancedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      btn.classList.add('clicked');
      setTimeout(() => btn.classList.remove('clicked'), 150);
      const value = btn.getAttribute('data-value');
      
      if (value === 'MC') {
        memory = 0;
      } else if (value === 'MR') {
        currentInput = memory.toString();
        updateDisplay();
      } else if (value === 'M+') {
        memory += parseFloat(currentInput) || 0;
      } else if (value === 'M−') {
        memory -= parseFloat(currentInput) || 0;
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (!isNaN(key) || key === '.') {
      appendNumber(key);
    } else if (['+', '-', '/', '*', 'x', '÷', '×', '−'].includes(key)) {
      const opMap = { '*': '×', 'x': '×', '/': '÷', '-': '−' };
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
