// import logo from './logo.svg';
import React from 'react';
import './App.css';
import CarbonCreditDashboard from './pages/CarbonCreditDashboard'
import UserPage from './pages/UserPage.js'
import { Web3Provider } from './contexts/Web3Context';
// import EthereumAccount from './components/EthereumAccount';
function App() {

  return (
    <Web3Provider>
      <UserPage />
      <CarbonCreditDashboard />
    </Web3Provider >
  );
}

export default App;
