import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function ConnectButton() {
  const [accountAddress, setAccountAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  //useEffect(() => { const { ethereum } = window;}, []);

  const connectWallet = async () => {
    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccountAddress(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  return (
    <div className="ConnectButton">
        {isConnected ? (
        <button className="btn">
            {accountAddress.slice(0, 4)}...
            {accountAddress.slice(38, 42)}
        </button>
        ) : (
        <button className="btn" onClick={connectWallet}>
            Connect
        </button>
        )}
    </div>
  );
}

export default ConnectButton;