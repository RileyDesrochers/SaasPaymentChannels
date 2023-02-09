import React from 'react';
import { ethers } from 'ethers';
import { /*useEffect*/useState  } from "react"
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
const paymentRecipient = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
const contract = require('../../Channel.json');

function AccountManagment() {
  const [bal, setBal] = useState('0')
  const { address, isConnected } = useAccount();

  const { refetch } = useContractRead({
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: contract.abi,
    functionName: 'balanceOf',
    args: isConnected ? [address] : [ethers.constants.AddressZero],
    chainId: 31337,
    onSuccess(data) {
      setBal(data.toString());
    }
  });

  const { config: openConfig } = usePrepareContractWrite({
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: contract.abi,
    functionName: 'open',
    args: [paymentRecipient, 10000],
    chainId: 31337,
  })

  const { write: openWrite } = useContractWrite({
    ...openConfig,
    onSuccess(_) {
      refetch();
    },
  });

  const { config: airdropConfig } = usePrepareContractWrite({
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: contract.abi,
    functionName: 'airdrop',
    args: [100000],
    chainId: 31337,
  })
  const { write: airdropWrite } = useContractWrite({
      ...airdropConfig,
      onSuccess(_) {
        refetch();
      },
  });

  return (
    <div className="AccountManagment">
      <button className="DepositButton" disabled={true}>
        Deposit stable coins
      </button>
      <button className="WithdrawalButton" disabled={true}>
        Withdrawal stable coins
      </button>
      <button className="AirdropCoinsButton" disabled={!airdropWrite} onClick={() => airdropWrite?.()}>
        Airdrop coins (testing only)
      </button>
      <button className="OpenChannelButton" disabled={!openWrite} onClick={() => openWrite?.()}>
        Open payment channel
      </button>
      <p className="BalanceDisplay">
        <b>your balance: </b>{isConnected ? bal : '?'}
      </p>
    </div>
  );
}

export default AccountManagment;