import { useEffect, useState  } from "react"
import { ethers } from 'ethers';
import { useProvider, useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useSignMessage } from 'wagmi'
import axios from 'axios';
const paymentRecipient = '0x5AdA39e766c416CA083d8c7e43104f2C7cF2194A';
const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const contract = require('./Channel.json');
const url = "http://localhost:5000/";

export default function Body() {
    const provider = useProvider()
    const { address, isConnected } = useAccount()
    
    let channelContract = new ethers.Contract(contractAddress, contract.abi, provider);

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
    const [bal, setBal] = useState('0')
    const [max, setMax] = useState(0)
    const [round, setRound] = useState(ethers.BigNumber.from("0"))
    const [state, setState] = useState(0)
    const [used, setUsed] = useState(0)
    const [msg, setMsg] = useState(0)
    const [sudoku, setSudoku] = useState(blankBoard);
    //const [msgSig, setMsgSig] = useState(0)
    let cost = 100;

    //reads-----------------

    async function getBal(){
        const t = await channelContract.balanceOf(address);
        setBal(t.toString());
    }

    async function getMessageHash(){
        const t = await channelContract.getMessageHash(paymentRecipient, used+cost, round);
        setMsg(t);
    }

    async function getChannelByAddresses(){
        const data = await channelContract.getChannelByAddresses(address, paymentRecipient);
        //if(data.state === 1){
            /*axios.get(url+'ping', {}).then(function (response) {
                axios.post(url+'connect', {
                    address: address,
                }).then(function (response) {
                    console.log(response.data);
                }).catch(function (error) {
                    console.log(error);
                });
            }).catch(function (error) {
                console.log(error);
                alert("service provider is offline");
            });*/
        setMax(data.value)
        setRound(data.round[0])
        setState(data.state)
        getMessageHash();
        //}
    }


    useEffect(() => {
        getBal();
        getChannelByAddresses();
    });

    //writes----------------

    const { config: openConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'open',
        args: [paymentRecipient, 1000],
        chainId: 31337,
    })
    const { write: openWrite } = useContractWrite({
        ...openConfig,
        onSuccess(_) {
            getBal();
            getChannelByAddresses();
            getMessageHash();
        },
    });

    const { config: airdropConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'airdrop',
        args: [100000],
        chainId: 31337,
    })
    const { write: airdropWrite } = useContractWrite({
        ...airdropConfig,
        onSuccess(_) {
            getBal();
        },
    });

    //sign message-----------------

    const { signMessage } = useSignMessage({
        message: ethers.utils.arrayify(msg),
        onSuccess(data) {
            setUsed(used+cost)
        },
    })

    /*axios.post(url+'solve', {
                paymentSender: address,
                //paymentRecipient: paymentRecipient,
                total: used+cost,
                round: round.toString(),
                puzzle: sudoku,
                signature: data,
            }).then(function (response) {
                setSudoku(response.data.message);
                setUsed(used+cost)
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

    function cell(row, col){
        return (
        <div className="">
            <select className="bg-white text-black text-sm appearance-none w-full h-full text-center" name="cell" value={sudoku[row][col]} onChange={value => setSudoku(changeSudoku(value.target.value, row, col))}>
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

    return (
        <div className="grid grid-cols-2 divide-x m-4">
            <div className="mx-auto">
                <table className="m-2">
                    <tbody>
                    {
                    rows.map((row) => {
                        return (
                        <tr className="row" key={row}>
                            {
                            rows.map((col) => {
                            return(
                                <td className="border-2 border-black w-8 h-8" key={col}>{cell(row, col)}</td>
                            )
                            })
                            }
                        </tr>
                        )
                    })
                    }
                    </tbody>
                </table>
                <div className="grid grid-cols-2 divide-x">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-8 mr-6" onClick={() => signMessage()}>
                        Solve
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-8 ml-6" onClick={() => setSudoku(blankBoard)}>
                        Clear
                    </button>
                </div>
            </div>
            <div className="">
                <p className="py-4 px-4 font-bold text-3xl ml-5">
                    <b>your balance: </b>{bal}
                </p>
                <div className="grid grid-cols-2 divide-x m-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white m-2 font-bold py-2 px-4 rounded ml-4 mr-4 disabled:opacity-50" disabled={true}>
                        Deposit stable coins
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white m-2 font-bold py-2 px-4 rounded mr-4 ml-4 disabled:opacity-50" disabled={true}>
                        Withdrawal stable coins
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white m-2 font-bold py-2 px-4 rounded ml-4 mr-4 disabled:opacity-50" disabled={!openWrite} onClick={() => openWrite?.()}>
                        Open payment channel
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white m-2 font-bold py-2 px-4 rounded mr-4 ml-4 disabled:opacity-50" disabled={!airdropWrite} onClick={() => airdropWrite?.()}>
                        Airdrop coins (testing only)
                    </button>
                </div>
            </div>
        </div>
        
    );
}

/*
    
*/
