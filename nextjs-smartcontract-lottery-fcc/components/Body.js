import { /*useEffect*/useState  } from "react"
import { ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useSignMessage, useSignTypedData, useProvider } from 'wagmi'
import OpenChannel from "./OpenChannel";
import axios from 'axios';
const paymentRecipient = '0x5AdA39e766c416CA083d8c7e43104f2C7cF2194A';
const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const contract = require('./Channel.json');
const url = "http://localhost:5000/";

function sanitiseChannel(ch){//toString
    return {
      value: ch.value.toString(),
      state: ch.state,
      round: ch.round._value.toString(),
      lockTime: ch.lockTime.toString()
    }
  }

export default function Body() {
    const provider = useProvider()
    const { address } = useAccount()

    const blankBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const [bal, setBal] = useState("0")
    const [max, setMax] = useState("0")//onchain
    const [used, setUsed] = useState(0)//server
    const [round, setRound] = useState("0")//onchain
    const [state, setState] = useState("0")//onchain
    const [canSolve, setCanSolve] = useState(false)
    //const [msg, setMsg] = useState(0)
    const [sudoku, setSudoku] = useState(blankBoard);
    let channelContract = new ethers.Contract(contractAddress, contract.abi, provider);
    let cost = 100;

    //reads-----------------

    const { refetch: getChannelByAddressesRefetch } = useContractRead({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'getChannelByAddresses',
        args: [address, paymentRecipient],
        chainId: 31337,
        onSuccess(data) {
            data = sanitiseChannel(data);
            console.log(data)
            if(data.state === 1){
                axios.post(url+'connect', {
                    address: address,
                }).then(function (response) {
                    if(response.data.message === "channel open"){
                        let channel = response.data.channel;
                        if(data.round === channel.round && data.value === channel.max){
                            setUsed(response.data.channel.used);
                            setRound(data.round);
                            setMax(data.value);
                            setCanSolve(true);
                            console.log(channel);
                        }
                    }else{
                        console.log(response.data.message);
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }
            setState(data.state)
        }
    });

    /*const { refetch: getMessageHashRefetch } = useContractRead({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'getMessageHash',
        args: [paymentRecipient, used+cost, round],
        chainId: 31337,
        onSuccess(data) {
            setMsg(data);
        }
    });*/

    const { refetch: balanceOfRefetch } = useContractRead({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'balanceOf',
        args: [address],
        chainId: 31337,
        onSuccess(data) {
            setBal(data.toString());
        }
    });

    async function reSync(){
        balanceOfRefetch();
        getChannelByAddressesRefetch();
    }

    //writes----------------

    const { config: airdropConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'airdrop',
        args: [1000000000],
        chainId: 31337,
    })
    const { write: airdropWrite } = useContractWrite({
        ...airdropConfig,
        onSuccess(_) {
            balanceOfRefetch();
        },
    });

    //sign message-----------------

    const domain = {
        name: 'Atmosphere',
        version: '4',
        chainId: 31337,
        verifyingContract: contractAddress
    }
       
    const types = {
        Transaction: [
            { name: 'to', type: 'address' },
            { name: 'total', type: 'uint256' },
            { name: 'round', type: 'uint256' },
        ]
    } 
       
    const value = {
        to: paymentRecipient,
        total: used+cost,
        round: round,
    } 

    async function checkSig(sig){
        //let hash = await channelContract._hash(paymentRecipient, used+cost, round);//_verify
        let s2 = await channelContract.verify(address, value.to, value.total, value.round, sig);//_verify
        console.log(s2);
    }

    const { data, isError, isLoading, isSuccess, signTypedData } = useSignTypedData({
        domain,
        types,
        value,
        onSuccess(data) {
            if(checkSig(data)){
                axios.post(url+'solve', {
                    paymentSender: address,
                    total: used+cost,
                    puzzle: sudoku,
                    signature: data,
                }).then(function (response) {
                    if(response.data.message === "puzzle solved"){
                        setSudoku(response.data.puzzle);
                        setUsed(used+cost)
                    }else{
                        console.log(response.data.message)
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }else{
                console.log("invalid signature error")
            }
        },
    });

    /*axios.post(url+'solve', {
                paymentSender: address,
                //paymentRecipient: paymentRecipient,
                total: used+cost,
                round: round.toString(),
                puzzle: sudoku,
                signature: data,
            }).then(function (response) {
                setSudoku(response.data.message);
                //setUsed(used+cost)
                //console.log(response.data.message);
            }).catch(function (error) {
                console.log(error);
            });*/

    //build UI--------
    
    const rows = [0,1,2,3,4,5,6,7,8];

    function changeSudoku(val, row, col){
        let tmp = rows.map((r) => {
        return [...sudoku[r]];
        })
        tmp[row][col] = parseInt(val);
        return tmp;
    }

    function _cell(row, col){
        return(
            <div className="w-12 h-12 m-0">
                <select className="m-0 p-0 w-full h-full bg-white text-center appearance-none text-black" name="Cell" value={sudoku[row][col]} onChange={value => setSudoku(changeSudoku(value.target.value, row, col))}>
                    <option value="0">?</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                </select>
            </div>
        )
    }

    function getCell(row, col){
        if(col%3 == 0){
            return (
                <td className="m-0 p-0 border border-l-2 border-black" key={col}>
                    {_cell(row, col)}
                </td>
            )
        }else if(col%3 == 2){
            return (
                <td className="m-0 p-0 border border-r-2 border-black" key={col}>
                    {_cell(row, col)}
                </td>
            )
        }else{
            return (
                <td className="m-0 p-0 border border-black" key={col}>
                    {_cell(row, col)}
                </td>
            )
        }
        
    }

// border border-black 
    function getRow(row){
        if(row%3 == 0){
            return (
                <tr className="m-0 p-0 border-t-2 border-black" key={row}>
                    {rows.map((col) => {return(getCell(row, col))})}
                </tr>
            )
        }else if(row%3 == 2){
            return (
                <tr className="m-0 p-0 border-b-2 border-black" key={row}>
                    {rows.map((col) => {return(getCell(row, col))})}
                </tr>
            )
        }else{
            return (
                <tr className="m-0 p-0 border-black" key={row}>
                    {rows.map((col) => {return(getCell(row, col))})}
                </tr>
            )
        }
    }
//
    return (
        <div className="grid grid-cols-2 divide-x">
            <div className="mx-auto p-4">
                <table className="m-0 p-0">
                    <tbody>
                        {rows.map((row) => {return(getRow(row))})}
                    </tbody>
                </table>
                <div className="grid grid-cols-2 divide-x">
                    <button className="my-4 ml-5 mr-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" disabled={!canSolve} onClick={() => signTypedData()}>
                        Solve
                    </button>
                    <button className="my-4 mr-5 ml-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" onClick={() => setSudoku(blankBoard)}>
                        Clear
                    </button>
                </div>
            </div>
            <div className="">
                <p className="ml-5 py-4 px-4 font-bold text-3xl">
                    <b>your balance: {bal}</b>
                </p>
                <div className="grid grid-cols-2 divide-x">
                    <button className="my-2 ml-8 mr-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" disabled={!airdropWrite} onClick={() => airdropWrite?.()}>
                        Airdrop coins (testing only)
                    </button>
                    {(bal > 1000000) ? (<OpenChannel handle={reSync}/>) : (<button className="my-2 mr-4 ml-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" disabled={true}>Fund Channel</button>)}
                </div>
            </div>
        </div>
        
    );
}

/*
    <button className="bg-blue-500 hover:bg-blue-700 text-white m-2 font-bold py-2 px-4 rounded mx-4 disabled:opacity-50" disabled={true}>
                    Deposit stable coins
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white m-2 font-bold py-2 px-4 rounded mx-4 disabled:opacity-50" disabled={true}>
                    Withdrawal stable coins
                </button>

    
    

*/
