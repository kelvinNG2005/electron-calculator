import React, { useState } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import History from './History';
import './Calculator.css';


type Operator = '+'|'-'|'*'|'/'|null;

interface HistoryItem {
  calculation: string;
  result: string;
  timestamp: Date;
}

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState<string>('0');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<Operator>(null);
    const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const inputDigit = (digit: number): void => {
        if (waitingForOperand){
            setDisplay(String(digit));
            setWaitingForOperand(false);
        } else{
            setDisplay(display === '0' ? String(digit) : display + digit);
        }
    };
  
    const inputDecimal = (): void => {
        if (waitingForOperand){
            setDisplay('0.');
            setWaitingForOperand(false);
        } else if(!display.includes('.')){
            setDisplay(display + '.');
        }
    };

    const clearDisplay = (): void =>{
        setDisplay('0');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    
    const addToHistory = (calculation: string, result: string) => {
        const newItem: HistoryItem = {
        calculation,
        result,
        timestamp: new Date()
        };
        setHistory([newItem, ...history].slice(0, 10)); 
    };


    const performOperation = (nextOperator: Operator): void => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operator) {
            const currentValue = previousValue || 0;
            let newValue: number = 0;
            let calculation = '';

            switch (operator) {
                case '+':
                    newValue = currentValue + inputValue;
                    calculation = `${currentValue} + ${inputValue}`;
                    break;
                case '-':
                    newValue = currentValue - inputValue;
                    calculation = `${currentValue} - ${inputValue}`;
                    break;
                case '*':
                    newValue = currentValue * inputValue;
                    calculation = `${currentValue} × ${inputValue}`;
                    break;
                case '/':
                    newValue = currentValue / inputValue;
                    calculation = `${currentValue} ÷ ${inputValue}`;
                    break;
                default:
                    return;
            }

            setPreviousValue(newValue);
            setDisplay(String(newValue));
            addToHistory(calculation, String(newValue));
        }
        setWaitingForOperand(true);
        setOperator(nextOperator);
    };

    const calculateResult = (): void => {
        if (operator && previousValue !== null) {
            performOperation(operator);
            setOperator(null);
        }
    };

    return (
    <div className="calculator-container">
      <div className="calculator-main">
        <Display value={display} />
        <Keypad
          onDigitClick={inputDigit}
          onOperatorClick={(op) => performOperation(op)}
          onDecimalClick={inputDecimal}
          onClearClick={clearDisplay}
          onEqualsClick={calculateResult}
        />
      </div>
      <History items={history} />
    </div>
  );
};

export default Calculator;