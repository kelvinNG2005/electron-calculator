import React from 'react';
import Calculator from './components/Calculator';


const App: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Calculator</h1>
      </header>
      <Calculator />
      <footer>
        <p>Version 1.0.0 | Created for SWE40006</p>
      </footer>
    </div>
  );
};

export default App
