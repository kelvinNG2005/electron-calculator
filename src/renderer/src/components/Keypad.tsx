import React from 'react';
import Button from './Button';

interface KeypadProps {
  onDigitClick: (digit: number) => void;
  onOperatorClick: (operator: '+' | '-' | '*' | '/') => void;
  onDecimalClick: () => void;
  onClearClick: () => void;
  onEqualsClick: () => void;
}

const Keypad: React.FC<KeypadProps> = ({
  onDigitClick,
  onOperatorClick,
  onDecimalClick,
  onClearClick,
  onEqualsClick
}) => {
  return (
    <div className="calculator-keypad">
      <Button onClick={onClearClick} className="key-clear">C</Button>
      <Button onClick={() => onOperatorClick('/') }  className="key-operator">÷</Button>
      <Button onClick={() => onOperatorClick('*')}  className="key-operator">×</Button>
      <Button onClick={() => onOperatorClick('-')}  className="key-operator">-</Button>
      
      <Button onClick={() => onDigitClick(7)}>7</Button>
      <Button onClick={() => onDigitClick(8)}>8</Button>
      <Button onClick={() => onDigitClick(9)}>9</Button>
      <Button onClick={() => onOperatorClick('+')}  className="key-operator">+</Button>
      
      <Button onClick={() => onDigitClick(4)}>4</Button>
      <Button onClick={() => onDigitClick(5)}>5</Button>
      <Button onClick={() => onDigitClick(6)}>6</Button>
      <Button onClick={onEqualsClick} className="key-equals">=</Button>
      
      <Button onClick={() => onDigitClick(1)}>1</Button>
      <Button onClick={() => onDigitClick(2)}>2</Button>
      <Button onClick={() => onDigitClick(3)}>3</Button>
      <Button onClick={() => onDigitClick(0)} className="key-zero">0</Button>
      
      <Button onClick={onDecimalClick} className="key-decimal">.</Button>
    </div>
  );
};

export default Keypad;