const express = require("express");
const app = express();
const ethers = require('ethers');
//const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const abis = require('../abi/abiBuilder.js');
//const contract = require('./Channel.json');
const wasm = require('./sudoku/pkg/sudoku.js');
require('dotenv').config()

let chainId = 0;
for(let n =0;n<process.argv.length;n++){
  if(process.argv[n].substring(0,7) === "chainId"){
    chainId = parseInt(process.argv[n].substring(8));
  }
}
if(chainId === 0){chainId = 31337}

const channelConf = abis.channelAbi(chainId);

const provider = new ethers.providers.JsonRpcProvider();
const signer = new ethers.Wallet.fromMnemonic(process.env.RECIVER_MNEMONIC);
let channelContract = new ethers.Contract(channelConf.address, channelConf.abi, provider);


let cost = ethers.BigNumber.from(100);

let channels = {}

function sanitiseChannel(ch){
  return {
    value: ch.value,
    state: ch.state,
    round: ch.round._value.toString(),
    lockTime: ch.lockTime.toString()
  }
}

async function checkSig(sender, transaction, sig){
  return (await channelContract.verify(sender, transaction.to, transaction.total, transaction.round, sig));
}

/*async function close(address, sig){
  await channelContract.connect(signer).reciverCollectPayment(address, channels[address].used, channels[address].round, sig);  
}*/
//console.log(channelConf)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });


app.post("/connect", async function(req, res) {
  var msg = req.body;
  let state = sanitiseChannel(await channelContract.getChannelByAddresses(msg.address, signer.address));
  if(state.state !== 1){
    res.send({
      message: 'open channel first',
      paymentRecipient: signer.address
    });
    return;
  }

  let channel;
  if(channels.hasOwnProperty(msg.address)){
    channel = channels[msg.address];
    if(channel.round !== state.round){
      channel = {
        used: ethers.BigNumber.from(0),
        max: state.value,
        round: state.round,
        lastMsg: {}
      };
    }else if(channel.max !== state.value){
      channel.max = state.value;
    }
  }else{
    channel = {
      used: ethers.BigNumber.from(0),
      max: state.value,
      round: state.round,
      lastMsg: {}
    };
  }
  channels[msg.address] = channel;
  console.log(channel);
  channel.max = channel.max.toString();
  res.send({
    message: 'channel open',
    channel: channel,
    paymentRecipient: signer.address
  });
});

app.post("/solve", async function(req, res) {
  var msg = req.body;
  let sender = msg.paymentSender;
  if(!channels.hasOwnProperty(sender)){
    res.send({
      message: "connect first",
    });
    return;
  }
  
  let channel = channels[sender];
  let transaction = {
    to: signer.address,
    total: msg.total,
    round: channel.round
  }

  msg.total = ethers.BigNumber.from(msg.total);
  
  if(!msg.total.gte(channel.used.add(cost))){
    res.send({
      message: "payment to enough",
    });
    return;
  }else if(!msg.total.lte(channel.max)){
    res.send({
      message: "exceds channel limit",
    });
    return;
  }

  //console.log(msg.round, channel.round);
  //round.eq(channels[sender].round)){//make sure not pass channel limit
  if(await checkSig(sender, transaction, msg.signature)){
    let puz = msg.puzzle.map(x => new Uint8Array(x))
    puz = wasm.sol(puz);
    puz = puz.map(x => Array.from(x))
    for(let n=0;n<9;n++){
      for(let m=0;m<9;m++){
        if(puz[n][m] === 0){
          res.send({
            message: "unSolveable puzzle",
          });
          return;
        }
      }
    }
    channels[sender].used = msg.total;
    channels[sender].lastMsg = msg;
    console.log(channel);
    res.send({
      message: "puzzle solved",
      puzzle: puz
    });
  }else{
    res.send({
      message: "invalid signature",
    });
  }
});

let port = process.env.PORT;

if(port == null || port == "") {
 port = 5000;
}

app.listen(port, function() {
  console.log("server started", port);
});