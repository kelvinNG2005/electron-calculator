import React from 'react';
import Calculator from './components/Calculator';
import UpdateNotification from './components/UpdateNotification'


const App: React.FC = () => {
  return (
    <div>
      <UpdateNotification />
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
