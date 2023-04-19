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
cd sudoku/
wasm-pack build --target nodejs
cd ..
node app.js
```
and in the 3rd in the front_end folder
```
npm i
yarn dev
```
Open a web browser to http://localhost:3000/, then connect your web wallet to http://localhost:8545. The deploy script should have already sent your address funds. Hit the approve, then the deposit buttons, and sign the transactions to fund the contract. Hit the fund channel button to create a micropayment channel between you and the server. Fill in some hints in the sudoku puzzle, then hit "Solve" and sign the message. You can hit "clear" and do it again. 

Hitting solve sends a micropayment to the server in the form of a signed message with an incrementing "total" value. The server uses code written in Rust and compiled in web assembly to solve the puzzle. The server can then claim the "total" from the micropayment channel whenever it wants.

Side note: if you restart your local node, you may need to "clear activity tab data" in metamasks advanced settings menu