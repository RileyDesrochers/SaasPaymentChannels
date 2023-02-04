import React from 'react';
//import { ethers } from 'ethers';
//import { useSelector/*, useDispatch*/ } from 'react-redux'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
const contract = require('../../Channel.json');

function AirdropCoinsButton() {
  const { config } = usePrepareContractWrite({
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: contract.abi,
    functionName: 'airdrop',
    args: [100000],
    chainId: 31337,
    onSuccess(data) {
      console.log('Success', data)
    }
  })
  const { /*data, isLoading, isSuccess, */write } = useContractWrite(config);

  return (
    <button className="AirdropCoinsButton" disabled={!write} onClick={() => write?.()}>
        Airdrop coins (testing only)
    </button>
  );
}
export default AirdropCoinsButton;