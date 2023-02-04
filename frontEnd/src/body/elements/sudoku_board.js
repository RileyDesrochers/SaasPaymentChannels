import React from 'react'
import SudokuCell from './sudoku_cell.js';

function SudokuBoard() {
  const rows = [0,1,2,3,4,5,6,7,8];

  return (
    <div className="SudokuBoard">
        <table className="game__board">
            <tbody>
            {
              rows.map((row) => {
                return (
                  <tr className="row" key={row}>
                    {
                    rows.map((column) => {
                      return(
                        <td className="Cell" key={column}><SudokuCell coords={[row, column]}/></td>
                      )
                    })
                    }
                  </tr>
                )
              })
            }
            </tbody>
        </table>
    </div>
  );
}

export default SudokuBoard;