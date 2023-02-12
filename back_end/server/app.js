const express = require("express");
//const Quote = require('inspirational-quotes');
const fs = require('fs');
const util = require('util');
const app = express();
const ethers = require('ethers');
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const contract = require('./Channel.json');
const wasm = require('./sudoku/pkg/sudoku.js');
require('dotenv').config()



//console.log(wasm.sol(s));
//s[0][2] = 5
//console.log(s);



//const myAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";//MNEMONIC
//const provider = 'http://localhost:8545';//process.env.PRIVATE_KEY
const provider = new ethers.providers.JsonRpcProvider();
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
let channelContract = new ethers.Contract(contractAddress, contract.abi, provider);

let cost = 100;

let channels = {}
/*class PaymentChannel {
  constructor(_channelID, _channelBalance, _userID, _publicKey){
      this.channelID = _channelID;
      this.channelBalance = _channelBalance;
      this.balanceUsed = 0;
      this.userID = _userID;
      this.publicKey = _publicKey;
      this.transactions = [];
  }
}*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.get("/ping", async function(req, res) {
  res.send({
    message: 'online',
  });
});

app.post("/test", async function(req, res) {
  var msg = req.body;
  console.log(msg);
  res.send({
    message: 'msg received',
  });
  /*if(await verifyMessage(msg, addr, req.body.ETHSig)){
    //key = msg.publicKey;

    res.send({
      message: 'channel opened',
    });
  }else{
    res.send({
      message: 'invalid signature',
    });
  }*/
  
});

app.post("/connect", async function(req, res) {
  var msg = req.body;
  let state = await channelContract.getChannelByAddresses(msg.address, signer.address);
  if(state.state === 1){
    let channel = {
      used: 0,
      max: state.value,
      round: state.round[0],
      lastMsg: {}
    }
    channels[msg.address] = channel;
    console.log(channels[msg.address]);
    res.send({
      message: 'channel open',
    });
  }else{
    res.send({
      message: 'wrong channel state',
    });
  }
});

app.post("/solve", async function(req, res) {
  var msg = req.body;
  msg.round = ethers.BigNumber.from(msg.round)
  msg.puzzle = msg.puzzle.map(x => new Uint8Array(x))
  console.log(msg);
  let sender = msg.paymentSender;
  if(msg.total>=(channels[sender].used+cost) && msg.round.eq(channels[sender].round)){//make sure not pass channel limit
    channels[sender].used = msg.total;
    lastMsg = msg;
    console.log(wasm.sol(msg.puzzle));
    res.send({
      message: 'Done!',
    });
  }else{
    //console.log(msg.total>=(channels[sender].used+cost), msg.round.eq(channels[sender].round));
    res.send({
      message: 'ow no!',
    });//ethers.BigNumber.from("0")
  }
  /*if(await verifyMessage(msg, addr, req.body.ETHSig)){
    //key = msg.publicKey;

    res.send({
      message: 'channel opened',
    });
  }else{
    res.send({
      message: 'invalid signature',
    });
  }*/
  
});

let port = process.env.PORT;

if(port == null || port == "") {
 port = 5000;
}

app.listen(port, function() {
  console.log("server started");
});