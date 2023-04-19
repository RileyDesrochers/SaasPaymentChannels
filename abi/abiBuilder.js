const contractAddresses = require("./contractAddresses.json")
const Channel = require("./Channel.json")
const USDC = require("./USDC.json")

function channelAbi(chainID){
    if(contractAddresses.hasOwnProperty(chainID)){
        let address = contractAddresses[chainID]["channel"];
        return {
            address: address,
            abi: Channel.abi,
            chainId: chainID
        }
    }else{
        return {};
    }
}

function usdcAbi(chainID){
    if(contractAddresses.hasOwnProperty(chainID)){
        let address = contractAddresses[chainID]["usdc"];
        return {
            address: address,
            abi: USDC.abi,
            chainId: chainID
        }
    }else{
        return {};
    }
}

module.exports = {
    channelAbi,
    usdcAbi,
}