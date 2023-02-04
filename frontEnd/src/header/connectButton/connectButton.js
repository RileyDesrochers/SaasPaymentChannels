//import { setBal } from '../../web3_store.js'
import { useConnect, useAccount} from 'wagmi'
//import { useDispatch } from 'react-redux'
//const contract = require('../../Channel.json');

function ConnectButton() {
  const { connect, connectors } = useConnect(
    /*{
      onSuccess(data) {
        useContractRead({
          address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          abi: contract.abi,
          functionName: 'balanceOf',
          args: [data.address],
          chainId: 31337,
          onSuccess(data) {
            dispatch(setBal(data));
            console.log(data);
          }
        })
        console.log(data);
      }
    }*/
  );

  const { address } = useAccount()

  return (
    <div className="ConnectButton">
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {address.slice(0, 4)}...
          {address.slice(38, 42)}
        </button>
      ))}
    </div>
  )
}

export default ConnectButton;