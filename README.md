# SASSPaymentChannels

## Quickstart

Create a .env file in the smart_contracts folder, copy the code below and fill in your details (SENDER_ADDRESS for the wallet your going to use in the front end, and RECIVER_MNEMONIC should be for a different address), then copy this file to the back_end folder

```
SENDER_ADDRESS=<your address> 
RECIVER_MNEMONIC=<your mnemonic>
```

open up 3 termanals

in the first move to the smart_contract folder and enter
```
npm i
npx hardhat node
```
in the second also in the smart_contract enter
```
npx hardhat run --network localhost scripts/deploy.js
cd ../back_end
npm i
node app.js
```
and in the 3rd in the front_end folder
```
yarn i
yarn dev
```