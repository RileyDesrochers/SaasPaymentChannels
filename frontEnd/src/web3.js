import { ethers } from 'ethers';
import { useSelector, useDispatch } from 'react-redux'
import { Connect, getBal } from '../../web3_store.js'
const contract = require('./Channel.json');

const ethereum = window.ethereum;
const provider = new ethers.providers.Web3Provider(ethereum);

const dispatch = useDispatch()

const ChannelsContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const ChannelsContractAbi = contract.abi;
//const web3 = useSelector((state) => state.web3)
const ChannelsContract = new ethers.Contract(
    ChannelsContractAddress,
    ChannelsContractAbi,
    provider
);



async function connectWallet(){
    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      dispatch(Connect(accounts));
      //dispatch(getBal(accounts));
      return true;
    } catch (error) {
      return false;
    }
};



//let r = await ChannelsContract.balanceOf(web3.address);
//r = r.toString();
