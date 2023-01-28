import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './header/header.js';
//import ConnectButton from './header/connectButton/connectButton.js';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
    </div>
  );
}

export default App;