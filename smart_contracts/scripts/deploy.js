// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
require('dotenv').config()

let address = process.env.SENDER_ADDRESS;

const hre = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const USDC = await ethers.getContractFactory("USDC");
  const usdc = await USDC.deploy(1000000000);

  const Channel = await hre.ethers.getContractFactory("Channel");
  const channel = await Channel.deploy("Atmosphere", usdc.address);

  await channel.deployed();

  await usdc.deployed();
  await usdc.transfer(address, 1000000000);
  
  await otherAccount.sendTransaction({
    to: address,
    // Convert currency unit from ether to wei
    value: ethers.utils.parseEther('20')
  })

  console.log(
    `USDC deployed to ${usdc.address}, channel deployed to ${channel.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
