import React from 'react';
//import { ethers } from 'ethers';
import AccountManagment from './account_managment/account_managment.js';
import SudokuBoard from './elements/sudoku_board.js';
//import SolveButton from './elements/solve_button.js';

//frontEnd/src/body/account_managment_tab/airdrop_coins_button.js
function Body() {

  return (
    <div className="Body">
        <AccountManagment />
        <SudokuBoard />
    </div>
  );
}

export default Body;