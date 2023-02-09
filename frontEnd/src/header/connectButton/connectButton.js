import React from 'react';
import { useConnect, useAccount } from 'wagmi'

function ConnectButton() {
  const { address, isConnected } = useAccount();

  const { connect, connectors } = useConnect({
      onSuccess(data) {
        console.log("Connected!")
      }
  });

  return (
    <div className="ConnectButton">
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {isConnected ? (
              address.slice(0, 4) + '...' + address.slice(38, 42)
            ):(
              'Connect Wallet'
          )}
        </button>
      ))}
    </div>
  )
}

export default ConnectButton;