import { useState, useEffect } from "react"
import { useAccount, useContractRead, useSignTypedData, useNetwork } from 'wagmi'
import { channelAbi, usdcAbi } from 'abis';
import OpenChannel from "./OpenChannel";
import Approve from "./Approve";
import Deposit from "./Deposit";
import axios from 'axios';
import { ethers } from "ethers";
//const paymentRecipient = '0x5AdA39e766c416CA083d8c7e43104f2C7cF2194A';
const url = "http://localhost:5000/";

function sanitiseChannel(ch){//toString
    return {
      value: ch.value,
      state: ch.state,
      round: ch.round._value.toString(),
      lockTime: ch.lockTime.toString()
    }
  }

export default function Body() {
    const { address } = useAccount()
    const { chain } = useNetwork()
    
    const channelConf = channelAbi(chain.id);
    const usdcConf = usdcAbi(chain.id);

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
    const [bal, setBal] = useState("0");
    const [allowance, setAllowance] = useState("0");
    const [max, setMax] = useState(ethers.BigNumber.from(0))
    const [used, setUsed] = useState(ethers.BigNumber.from(0))
    const [round, setRound] = useState("0")
    const [canSolve, setCanSolve] = useState(false)
    const [sudoku, setSudoku] = useState(blankBoard);
    const [paymentRecipient, setPaymentRecipient] = useState(ethers.constants.AddressZero);
    let cost = ethers.BigNumber.from(100);
    //console.log(paymentRecipient);
    //reads-----------------

    useEffect(() => {
        connect();
    }, []);
    
    async function connect(){
        axios.post(url+'connect', {
            address: address,
        }).then(function (response) {
            setPaymentRecipient(response.data.paymentRecipient);
            if(response.data.message === "channel open"){      
                let channel = response.data.channel; 
                console.log(channel);      
                setUsed(ethers.BigNumber.from(channel.used));
                setRound(channel.round);           
                setMax(ethers.BigNumber.from(channel.max));
            }else{
                console.log(response.data.message);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    const { refetch: getChannelByAddressesRefetch } = useContractRead({
        ...channelConf,
        functionName: 'getChannelByAddresses',
        args: [address, paymentRecipient],
        onSuccess(data) {
            data = sanitiseChannel(data);
            console.log(data)
            if(data.round === round && max.eq(data.value) && max.gte(cost)){//
                setCanSolve(true);
            }

        }
    });

    const { refetch: balanceOfRefetch } = useContractRead({
        ...channelConf,
        functionName: 'balanceOf',
        args: [address],
        onSuccess(data) {
            setBal(data.toString());
        }
    });

    const { refetch: allowanceRefetch } = useContractRead({
        ...usdcConf,
        functionName: 'allowance',
        args: [address, channelConf.address],
        onSuccess(data) {
            setAllowance(data.toString());
        }
    });

    async function reSync(){
        balanceOfRefetch();
        await connect();
        getChannelByAddressesRefetch();
    }

    async function onApprove(){
        allowanceRefetch();
    }

    async function onDeposit(){
        balanceOfRefetch();
        allowanceRefetch();
    }

    //writes----------------    

    //sign message-----------------

    const domain = {
        name: 'Atmosphere',
        version: '4',
        chainId: channelConf.chainId,
        verifyingContract: channelConf.address,
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
        total: used.add(cost).toString(),
        round: round,
    } 

    const { signTypedData } = useSignTypedData({
        domain,
        types,
        value,
        onSuccess(data) {
            axios.post(url+'solve', {
                paymentSender: address,
                total: value.total,
                puzzle: sudoku,
                signature: data,
            }).then(function (response) {
                if(response.data.message === "puzzle solved"){
                    setSudoku(response.data.puzzle);
                    setUsed(ethers.BigNumber.from(value.total))
                }else{
                    console.log(response.data.message)
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
    });

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
        if(sudoku[row][col] == "0"){
            return(
                <div className="w-12 h-12 m-0">
                    <select className="m-0 p-0 w-full h-full bg-slate-100 text-center appearance-none text-black" name="Cell" value={sudoku[row][col]} onChange={value => setSudoku(changeSudoku(value.target.value, row, col))}>
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
        }else{
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
            <div className="p-4">
                <p className="ml-5 py-4 px-4 font-bold text-3xl">
                    <b>your balance: {bal}</b>
                </p>
                <div className="grid grid-cols-2 divide-x">
                    {(allowance >= 1000000000) ? (<Deposit handle={onDeposit}/>) : (<Approve handle={onApprove}/>)}
                    {(bal >= 1000000) ? (<OpenChannel paymentRecipient={paymentRecipient} handle={reSync}/>) : (<button className="my-2 mx-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" disabled={true}>Fund Channel</button>)}
                </div>
            </div>
        </div>
    );
}

/*
    <button className="my-2 ml-8 mr-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" disabled={!depositWrite} onClick={() => depositWrite?.()}>
                        Deposit stable coins
                    </button>

                <button className="bg-blue-500 hover:bg-blue-700 text-white m-2 font-bold py-2 px-4 rounded mx-4 disabled:opacity-50" disabled={true}>
                    Withdrawal stable coins
                </button>

                <button className="my-2 ml-8 mr-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" disabled={!airdropWrite} onClick={() => airdropWrite?.()}>
                        Airdrop coins (testing only)
                    </button>

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
    

*/
