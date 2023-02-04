import React from 'react';
import { useAccount, useContractRead } from 'wagmi'
import { useSelector, useDispatch } from 'react-redux'
import { setBal } from '../../web3_store.js'
const contract = require('../../Channel.json');

function BalanceDisplay() {
  const dispatch = useDispatch()
  const bal = useSelector(state => state.web3.Balance);
  const { address } = useAccount();
  //const { data, isError, isLoading } = 
  useContractRead({
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: contract.abi,
    functionName: 'balanceOf',
    args: [address],
    chainId: 31337,
    onSuccess(data) {
      dispatch(setBal(data.toString()));
    }
  });


  return (
    <p className="BalanceDisplay">
        <b>your balance: </b>{bal}
    </p>
  );
}
//frontEnd/src/smart_contracts/artifacts/contracts/channel.sol/Channel.json  
export default BalanceDisplay;