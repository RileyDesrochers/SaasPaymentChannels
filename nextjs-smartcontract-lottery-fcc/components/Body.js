import { /*useEffect*/useState  } from "react"
import { ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useSignMessage } from 'wagmi'
import axios from 'axios';
const paymentRecipient = '0x5AdA39e766c416CA083d8c7e43104f2C7cF2194A';
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const contract = require('./Channel.json');
const url = "http://localhost:5000/";

export default function Body() {
    
    const { address, isConnected } = useAccount()

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
    //const provider = useProvider()
    const [bal, setBal] = useState('0')
    const [max, setMax] = useState(0)
    const [used, setUsed] = useState(0)
    const [round, setRound] = useState(ethers.BigNumber.from("0"))
    const [state, setState] = useState(0)
    const [msg, setMsg] = useState(0)
    const [sudoku, setSudoku] = useState(blankBoard);
    //const [msgSig, setMsgSig] = useState(0)
    //let channelContract = new ethers.Contract(contractAddress, contract.abi, provider);
    let cost = 100;

    //reads-----------------

    const { refetch: getChannelByAddressesRefetch } = useContractRead({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'getChannelByAddresses',
        args: [address, paymentRecipient],
        chainId: 31337,
        onSuccess(data) {
            if(data.state === 1){
                axios.get(url+'ping', {}).then(function (response) {
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
                });
                setMax(data.value)
                setRound(data.round[0])
                setState(data.state)
            }
        }
    });

    const { refetch: getMessageHashRefetch } = useContractRead({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'getMessageHash',
        args: [paymentRecipient, used+cost, round],
        chainId: 31337,
        onSuccess(data) {
            setMsg(data);
        }
    });

    const { refetch: balanceOfRefetch } = useContractRead({
        address: contractAddress,
        abi: contract.abi,
        functionName: 'balanceOf',
        args: isConnected ? [address] : [ethers.constants.AddressZero],
        chainId: 31337,
        onSuccess(data) {
            setBal(data.toString());
        }
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
            balanceOfRefetch();
            getChannelByAddressesRefetch();
            getMessageHashRefetch();
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
            balanceOfRefetch();
        },
    });

    //sign message-----------------

    const { signMessage } = useSignMessage({
        message: ethers.utils.arrayify(msg),
        onSuccess(data) {
            axios.post(url+'solve', {
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
            });
        },
    })

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
        <div className="SudokuCell">
            <select name="cell" value={sudoku[row][col]} onChange={value => setSudoku(changeSudoku(value.target.value, row, col))}>
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
        <div className="SudokuBoard">
            <table className="game__board">
                <tbody>
                {
                rows.map((row) => {
                    return (
                    <tr className="row" key={row}>
                        {
                        rows.map((col) => {
                        return(
                            <td className="Cell" key={col}>{cell(row, col)}</td>
                        )
                        })
                        }
                    </tr>
                    )
                })
                }
                </tbody>
            </table>
            <button className="SolveButton" onClick={() => signMessage()}>
                Solve
            </button>
            <button className="ClearButton" onClick={() => setSudoku(blankBoard)}>
                Clear
            </button>
            <div className="p-5">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" disabled={true}>
                    Deposit stable coins
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" disabled={true}>
                    Withdrawal stable coins
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" disabled={!airdropWrite} onClick={() => airdropWrite?.()}>
                    Airdrop coins (testing only)
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" disabled={!openWrite} onClick={() => openWrite?.()}>
                    Open payment channel
                </button>
                <p className="py-4 px-4 font-bold text-3xl">
                    <b>your balance: </b>{bal}
                </p>
            </div>
        </div>
        
    );
    }
