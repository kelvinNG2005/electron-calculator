import React from 'react';
import Calculator from './components/Calculator';
import UpdateNotification from './components/UpdateNotification'
// @ts-ignore
import packageJson from '../../../package.json';

const App: React.FC = () => {
  return (
    <div>
      <UpdateNotification />
      <header>
        <h1>Calculator</h1>
      </header>
      <Calculator />
      <footer>
        <p>Version {packageJson.version} | Created for SWE40006</p>
      </footer>
    </div>
  );
};

export default App
