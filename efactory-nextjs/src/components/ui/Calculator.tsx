import React, { useState, useEffect } from 'react';
import { IconCopy } from '@tabler/icons-react';

interface CalculatorProps {
  onClose?: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [lastResult, setLastResult] = useState<string | null>(null);

  const inputNumber = (num: string) => {
    if (display === '0' || lastResult) {
      setDisplay(num);
      setExpression(lastResult ? num : expression + num);
      setLastResult(null);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const inputDecimal = () => {
    if (lastResult) {
      setDisplay('0.');
      setExpression('0.');
      setLastResult(null);
    } else if (display.indexOf('.') === -1) {
      const newDisplay = display + '.';
      setDisplay(newDisplay);
      setExpression(expression + '.');
    }
  };

  const inputOperator = (operator: string) => {
    if (lastResult) {
      setExpression(lastResult + operator);
      setLastResult(null);
    } else {
      setExpression(expression + operator);
    }
    setDisplay('0');
  };

  const inputParenthesis = (paren: string) => {
    if (paren === '(') {
      if (display !== '0' && !lastResult && !isNaN(parseFloat(display.slice(-1)))) {
        // If there's a number before, add multiplication
        setExpression(expression + '×(');
      } else {
        setExpression(expression + '(');
      }
    } else {
      setExpression(expression + ')');
    }
    setDisplay('0');
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setLastResult(null);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const backspace = () => {
    if (display.length > 1) {
      const newDisplay = display.slice(0, -1);
      setDisplay(newDisplay);
      // Update expression by removing last character
      setExpression(expression.slice(0, -1));
    } else {
      setDisplay('0');
      setExpression(expression.slice(0, -1));
    }
  };

  const evaluateExpression = (expr: string): number => {
    try {
      // Replace display symbols with JavaScript operators
      let jsExpression = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\s/g, '');

      // Basic validation for balanced parentheses
      const openParens = (jsExpression.match(/\(/g) || []).length;
      const closeParens = (jsExpression.match(/\)/g) || []).length;
      
      // Auto-close unclosed parentheses
      if (openParens > closeParens) {
        jsExpression += ')'.repeat(openParens - closeParens);
      }

      // Use Function constructor for safer evaluation
      const result = new Function('return ' + jsExpression)();
      return isFinite(result) ? result : 0;
    } catch {
      return 0;
    }
  };

  const calculate = () => {
    if (expression) {
      const result = evaluateExpression(expression);
      const resultStr = String(result);
      setDisplay(resultStr);
      setLastResult(resultStr);
      setExpression('');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(display);
      // You could add a toast notification here if needed
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = display;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (key >= '0' && key <= '9') {
        event.stopPropagation();
        inputNumber(key);
      } else if (key === '.') {
        event.stopPropagation();
        inputDecimal();
      } else if (key === '+') {
        event.stopPropagation();
        inputOperator('+');
      } else if (key === '-') {
        event.stopPropagation();
        inputOperator('-');
      } else if (key === '*') {
        event.stopPropagation();
        inputOperator('×');
      } else if (key === '/') {
        event.preventDefault();
        event.stopPropagation();
        inputOperator('÷');
      } else if (key === '(' || key === ')') {
        event.stopPropagation();
        inputParenthesis(key);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        event.stopPropagation();
        calculate();
      } else if (key === 'Escape') {
        event.stopPropagation();
        clear();
      } else if (key === 'Backspace') {
        event.stopPropagation();
        backspace();
      } else if ((event.ctrlKey || event.metaKey) && key === 'c') {
        event.preventDefault();
        event.stopPropagation();
        copyToClipboard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, expression, lastResult]);

  return (
    <div className="bg-card-color rounded-xl shadow-2xl border border-border-color w-[400px] overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Calculator</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Display */}
        <div className="bg-body-color rounded-lg p-4 mb-4 border border-border-color">
          <div className="text-right">
            <div className="text-sm text-font-color-100 h-6 overflow-hidden">
              {expression || ''}
            </div>
            <div className="text-3xl font-mono font-bold text-font-color break-all min-h-[40px] flex items-center justify-end">
              {display}
            </div>
          </div>
        </div>

        {/* Calculator Buttons */}
        <div className="space-y-2">
          {/* Row 1: C, CE, ⌫, ÷ */}
          <div className="flex gap-2">
            <button
              onClick={clear}
              className="flex-1 h-12 bg-danger text-white rounded-lg font-semibold hover:bg-danger-80 transition-colors"
            >
              C
            </button>
            <button
              onClick={clearEntry}
              className="flex-1 h-12 bg-danger text-white rounded-lg font-semibold hover:bg-danger-80 transition-colors"
            >
              CE
            </button>
            <button
              onClick={backspace}
              className="flex-1 h-12 bg-danger text-white rounded-lg font-semibold hover:bg-danger-80 transition-colors"
            >
              ⌫
            </button>
            <button
              onClick={() => inputOperator('÷')}
              className="flex-1 h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary-80 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
            >
              ÷
            </button>
          </div>

          {/* Row 2: 7, 8, 9, × */}
          <div className="flex gap-2">
            <button
              onClick={() => inputNumber('7')}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              7
            </button>
            <button
              onClick={() => inputNumber('8')}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              8
            </button>
            <button
              onClick={() => inputNumber('9')}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              9
            </button>
            <button
              onClick={() => inputOperator('×')}
              className="flex-1 h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary-80 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Row 3: 4, 5, 6, - */}
          <div className="flex gap-2">
            <button
              onClick={() => inputNumber('4')}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              4
            </button>
            <button
              onClick={() => inputNumber('5')}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              5
            </button>
            <button
              onClick={() => inputNumber('6')}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              6
            </button>
            <button
              onClick={() => inputOperator('-')}
              className="flex-1 h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary-80 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
            >
              -
            </button>
          </div>

          {/* Row 4: 1, 2, 3, + */}
          <div className="flex gap-2">
            <button
              onClick={() => inputNumber('1')}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              1
            </button>
            <button
              onClick={() => inputNumber('2')}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              2
            </button>
            <button
              onClick={() => inputNumber('3')}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              3
            </button>
            <button
              onClick={() => inputOperator('+')}
              className="flex-1 h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary-80 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
            >
              +
            </button>
          </div>

          {/* Row 5: (, ), 0, . */}
          <div className="flex gap-2">
            <button
              onClick={() => inputParenthesis('(')}
              className="flex-1 h-12 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-80 transition-colors"
            >
              (
            </button>
            <button
              onClick={() => inputParenthesis(')')}
              className="flex-1 h-12 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-80 transition-colors"
            >
              )
            </button>
            <button
              onClick={() => inputNumber('0')}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="flex-1 h-12 bg-body-color text-font-color border border-border-color rounded-lg font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              .
            </button>
          </div>

          {/* Row 6: = and Copy */}
          <div className="flex gap-2">
            <button
              onClick={calculate}
              className="h-12 bg-success text-white rounded-lg font-semibold hover:bg-success-80 transition-colors flex items-center justify-center"
              style={{ width: 'calc(75% - 4px)' }}
            >
              =
            </button>
            <button
              onClick={copyToClipboard}
              className="h-12 bg-info text-white rounded-lg font-semibold hover:bg-info-80 transition-colors flex items-center justify-center"
              style={{ width: 'calc(25% - 4px)' }}
              title="Copy result to clipboard"
            >
              <IconCopy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Keyboard shortcuts info */}
        <div className="mt-4 text-xs text-font-color-100 text-center">
          Keyboard shortcuts: Numbers, +, -, *, /, (, ), Enter/=, Esc (clear), Backspace, Ctrl+C (copy)
        </div>
      </div>
    </div>
  );
};

export default Calculator;