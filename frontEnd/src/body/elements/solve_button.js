import React from 'react';
//import { ethers } from 'ethers';
//import { useSelector/*, useDispatch*/ } from 'react-redux'
//import { fillCell } from './sudoku_store.js'

function SolveButton() {
  //const sudoku = useSelector((state) => state.sudoku.value)
  /*const web3 = useSelector((state) => state.web3)

  function p(){
    console.log(web3);
  }*/

  return (
    <div className="DepositButton">
        <button className="SolveButton" >
            Solve
        </button>
    </div>
  );
}

export default SolveButton;