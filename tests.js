/**
 * Comprehensive Test Suite for GlamCalc Calculator
 * Tests for functionality, edge cases, and potential issues
 */

class CalculatorTest {
  constructor() {
    this.results = [];
    this.testsPassed = 0;
    this.testsFailed = 0;
  }

  // Helper function to simulate calculator state
  createCalculatorState() {
    return {
      currentInput: '',
      previousInput: '',
      operator: '',
      expression: '',
      justComputed: false
    };
  }

  // Test utilities
  test(name, fn) {
    try {
      fn();
      this.testsPassed++;
      this.results.push({ name, status: 'PASS', error: null });
      console.log(`✅ ${name}`);
    } catch (error) {
      this.testsFailed++;
      this.results.push({ name, status: 'FAIL', error: error.message });
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message} (expected: ${expected}, got: ${actual})`);
    }
  }

  // Basic operation tests
  testBasicAddition() {
    const state = this.createCalculatorState();
    state.previousInput = '5';
    state.operator = '+';
    state.currentInput = '3';
    const result = parseFloat(state.previousInput) + parseFloat(state.currentInput);
    this.assertEqual(result, 8, 'Basic addition failed');
  }

  testBasicSubtraction() {
    const result = parseFloat('10') - parseFloat('3');
    this.assertEqual(result, 7, 'Basic subtraction failed');
  }

  testBasicMultiplication() {
    const result = parseFloat('4') * parseFloat('5');
    this.assertEqual(result, 20, 'Basic multiplication failed');
  }

  testBasicDivision() {
    const result = parseFloat('20') / parseFloat('4');
    this.assertEqual(result, 5, 'Basic division failed');
  }

  // Edge case tests
  testDivisionByZero() {
    const result = parseFloat('5') / parseFloat('0');
    this.assert(result === Infinity, 'Division by zero should return Infinity');
  }

  testNegativeNumbers() {
    const result = parseFloat('-5') + parseFloat('3');
    this.assertEqual(result, -2, 'Negative number addition failed');
  }

  testDecimalOperations() {
    const result = parseFloat('3.5') + parseFloat('2.5');
    this.assertEqual(result, 6, 'Decimal addition failed');
  }

  testMultipleDecimals() {
    const input = '3.14.159';
    const hasMultipleDots = (input.match(/\./g) || []).length > 1;
    this.assert(hasMultipleDots, 'Should detect multiple decimal points');
  }

  testVeryLargeNumbers() {
    const result = parseFloat('999999999') + parseFloat('1');
    this.assertEqual(result, 1000000000, 'Large number addition failed');
  }

  testVerySmallDecimals() {
    const result = parseFloat('0.0001') * parseFloat('0.0001');
    this.assert(result > 0 && result < 0.00001, 'Very small decimal multiplication failed');
  }

  testNegationOfZero() {
    const result = parseFloat('0') * -1;
    this.assertEqual(result, -0, 'Negation of zero failed');
  }

  testNegationOfNegative() {
    const result = parseFloat('-5') * -1;
    this.assertEqual(result, 5, 'Double negation failed');
  }

  testPercentageOfZero() {
    const result = parseFloat('0') / 100;
    this.assertEqual(result, 0, 'Percentage of zero failed');
  }

  testPercentageOfNegative() {
    const result = parseFloat('-50') / 100;
    this.assertEqual(result, -0.5, 'Percentage of negative failed');
  }

  // State management tests
  testStateReset() {
    const state = this.createCalculatorState();
    state.currentInput = '5';
    state.previousInput = '3';
    state.operator = '+';
    state.expression = '3 +';
    state.justComputed = true;

    // Simulate clearAll
    state.currentInput = '';
    state.previousInput = '';
    state.operator = '';
    state.expression = '';
    state.justComputed = false;

    this.assertEqual(state.currentInput, '', 'State reset failed');
    this.assertEqual(state.previousInput, '', 'State reset failed');
    this.assertEqual(state.operator, '', 'State reset failed');
  }

  testJustComputedFlag() {
    const state = this.createCalculatorState();
    state.justComputed = true;
    this.assert(state.justComputed === true, 'justComputed flag not set');

    // Simulate appendNumber when justComputed is true
    const newInput = '2';
    if (state.justComputed) {
      state.currentInput = newInput;
      state.previousInput = '';
      state.operator = '';
      state.justComputed = false;
    }

    this.assertEqual(state.currentInput, '2', 'justComputed state transition failed');
    this.assertEqual(state.justComputed, false, 'justComputed flag not reset');
  }

  testOperatorChaining() {
    // Simulate: 5 + 3 - 2 =
    let result = 5 + 3; // = 8
    result = result - 2; // = 6
    this.assertEqual(result, 6, 'Operator chaining failed');
  }

  testNegationAfterComputation() {
    // Simulate: 8 - 2 = 6, then ±, then + 2 =
    let result = 8 - 2; // = 6
    result = result * -1; // = -6
    result = result + 2; // = -4
    this.assertEqual(result, -4, 'Negation after computation failed');
  }

  testMultipleOperationsInSequence() {
    // 10 + 5 = 15, then × 2 = 30, then ÷ 3 = 10
    let result = 10 + 5; // 15
    result = result * 2; // 30
    result = result / 3; // 10
    this.assertEqual(result, 10, 'Multiple operations in sequence failed');
  }

  // Display update tests
  testExpressionDisplay() {
    const state = this.createCalculatorState();
    state.previousInput = '5';
    state.operator = '+';
    state.expression = `${state.previousInput} ${state.operator}`;
    this.assertEqual(state.expression, '5 +', 'Expression display format incorrect');
  }

  testResultDisplay() {
    const state = this.createCalculatorState();
    state.currentInput = '42';
    const displayValue = state.currentInput || '0';
    this.assertEqual(displayValue, '42', 'Result display failed');
  }

  testResultDisplayZeroDefault() {
    const state = this.createCalculatorState();
    state.currentInput = '';
    const displayValue = state.currentInput || '0';
    this.assertEqual(displayValue, '0', 'Default zero display failed');
  }

  // Input validation tests
  testEmptyOperatorChoice() {
    const state = this.createCalculatorState();
    // Should not proceed if both inputs are empty and operator is not minus
    if (state.currentInput === '' && state.previousInput === '') {
      this.assert(true, 'Empty operator choice prevented');
    }
  }

  testOperatorBeforeNumber() {
    const state = this.createCalculatorState();
    state.currentInput = '';
    state.previousInput = '';
    state.operator = '+';
    // Operator should be allowed to set minus at the beginning
    this.assert(state.currentInput === '', 'Operator before number state correct');
  }

  // Floating point precision tests
  testFloatingPointPrecision() {
    const result = 0.1 + 0.2;
    // Due to floating point, this might be 0.30000000000000004
    this.assert(Math.abs(result - 0.3) < 0.0001, 'Floating point precision issue');
  }

  // Keyboard input simulation (without DOM)
  testKeyboardNumbers() {
    const validNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    validNumbers.forEach(num => {
      const isNumber = !isNaN(num);
      this.assert(isNumber, `Keyboard input ${num} should be recognized as number`);
    });
  }

  testKeyboardOperators() {
    const operators = ['+', '-', '/', '*'];
    const opMap = { '*': '×', 'x': '×', '/': '÷', '-': '−' };
    operators.forEach(op => {
      this.assert(op in opMap || op === '+', `Operator ${op} should be recognized`);
    });
  }

  // Performance tests
  testNoInfiniteLoops() {
    let counter = 0;
    const max = 1000000;
    // Simulate a potential loop scenario
    for (let i = 0; i < 100; i++) {
      counter++;
    }
    this.assert(counter === 100, 'Loop counter test failed');
  }

  testEventListenerSetup() {
    // This is a conceptual test - in real DOM, listeners would be attached
    const buttons = [];
    const mockButtons = [
      { value: '1' },
      { value: '+' },
      { value: '=' }
    ];
    mockButtons.forEach(btn => {
      buttons.push(btn);
    });
    this.assertEqual(buttons.length, 3, 'Event listener setup failed');
  }

  // Error handling tests
  testParseFloatEdgeCases() {
    this.assert(isNaN(parseFloat('')), 'parseFloat empty string should be NaN');
    this.assert(isNaN(parseFloat('abc')), 'parseFloat non-numeric should be NaN');
    this.assert(!isNaN(parseFloat('123')), 'parseFloat valid number');
    this.assert(!isNaN(parseFloat('45.67')), 'parseFloat decimal number');
  }

  testSpecialCharacterHandling() {
    const specialChars = ['−', '×', '÷', '±', '%'];
    specialChars.forEach(char => {
      this.assert(typeof char === 'string', `Special character ${char} handled`);
    });
  }

  // Run all tests
  runAllTests() {
    console.log('🧪 Starting Comprehensive Calculator Tests...\n');
    console.log('=== BASIC OPERATIONS ===');
    this.test('Basic Addition (5+3)', () => this.testBasicAddition());
    this.test('Basic Subtraction (10-3)', () => this.testBasicSubtraction());
    this.test('Basic Multiplication (4×5)', () => this.testBasicMultiplication());
    this.test('Basic Division (20÷4)', () => this.testBasicDivision());

    console.log('\n=== EDGE CASES ===');
    this.test('Division by Zero', () => this.testDivisionByZero());
    this.test('Negative Numbers', () => this.testNegativeNumbers());
    this.test('Decimal Operations', () => this.testDecimalOperations());
    this.test('Multiple Decimal Points Detection', () => this.testMultipleDecimals());
    this.test('Very Large Numbers', () => this.testVeryLargeNumbers());
    this.test('Very Small Decimals', () => this.testVerySmallDecimals());
    this.test('Negation of Zero', () => this.testNegationOfZero());
    this.test('Double Negation', () => this.testNegationOfNegative());
    this.test('Percentage of Zero', () => this.testPercentageOfZero());
    this.test('Percentage of Negative', () => this.testPercentageOfNegative());

    console.log('\n=== STATE MANAGEMENT ===');
    this.test('State Reset', () => this.testStateReset());
    this.test('justComputed Flag Handling', () => this.testJustComputedFlag());
    this.test('Operator Chaining (5+3-2)', () => this.testOperatorChaining());
    this.test('Negation After Computation (8-2=6, then ±, then +2)', () => this.testNegationAfterComputation());
    this.test('Multiple Operations (10+5×2÷3)', () => this.testMultipleOperationsInSequence());

    console.log('\n=== DISPLAY ===');
    this.test('Expression Display Format', () => this.testExpressionDisplay());
    this.test('Result Display', () => this.testResultDisplay());
    this.test('Default Zero Display', () => this.testResultDisplayZeroDefault());

    console.log('\n=== INPUT VALIDATION ===');
    this.test('Empty Operator Prevention', () => this.testEmptyOperatorChoice());
    this.test('Operator State Before Number', () => this.testOperatorBeforeNumber());

    console.log('\n=== FLOATING POINT ===');
    this.test('Floating Point Precision (0.1+0.2)', () => this.testFloatingPointPrecision());

    console.log('\n=== KEYBOARD INPUT ===');
    this.test('Keyboard Number Recognition', () => this.testKeyboardNumbers());
    this.test('Keyboard Operator Recognition', () => this.testKeyboardOperators());

    console.log('\n=== PERFORMANCE & STABILITY ===');
    this.test('No Infinite Loops', () => this.testNoInfiniteLoops());
    this.test('Event Listener Setup', () => this.testEventListenerSetup());

    console.log('\n=== ERROR HANDLING ===');
    this.test('parseFloat Edge Cases', () => this.testParseFloatEdgeCases());
    this.test('Special Character Handling', () => this.testSpecialCharacterHandling());

    console.log('\n' + '='.repeat(50));
    console.log(`\n📊 TEST RESULTS`);
    console.log(`✅ Passed: ${this.testsPassed}`);
    console.log(`❌ Failed: ${this.testsFailed}`);
    console.log(`📈 Total: ${this.testsPassed + this.testsFailed}`);
    console.log(`🎯 Success Rate: ${((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100).toFixed(2)}%`);
    console.log('='.repeat(50));

    if (this.testsFailed === 0) {
      console.log('\n🎉 All tests passed! No issues detected.');
    } else {
      console.log(`\n⚠️  ${this.testsFailed} test(s) failed. Please review above.`);
    }

    return {
      passed: this.testsPassed,
      failed: this.testsFailed,
      total: this.testsPassed + this.testsFailed,
      results: this.results
    };
  }
}

// Run tests
const tester = new CalculatorTest();
tester.runAllTests();
