import { useEffect, useState  } from "react"
import { ethers } from 'ethers';
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
//import axios from 'axios';
const paymentRecipient = '0x5AdA39e766c416CA083d8c7e43104f2C7cF2194A';
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const contract = require('./Channel.json');
//const url = "http://localhost:5000/";

export default function OpenChannel(props) {
    //writes----------------
    const { config: openConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'open',
        args: [paymentRecipient, 1000000],
        chainId: 31337,
    })
    const { write } = useContractWrite({
        ...openConfig,
        onSuccess(_) {
            props.handle();
        },
    });

    return (
        <button className="my-2 mr-4 ml-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" disabled={!write} onClick={() => write?.()}>
            Fund Channel
        </button>
    );
}