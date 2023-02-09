import { /*useEffect*/useState  } from "react"


export default function SudokuBoard() {
  const rows = [0,1,2,3,4,5,6,7,8];
  const [sudoku, setSudoku] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]);

  function changeSudoku(val, row, col){
    let tmp = rows.map((r) => {
      return [...sudoku[r]];
    })
    tmp[row][col] = parseInt(val);
    return tmp;
  }

  function cell(row, col){
    return (
      <div className="SudokuCell">
          <select name="cell" value={sudoku[row][col]} onChange={value => setSudoku(changeSudoku(value.target.value, row, col))}>
              <option value="0">?</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
          </select>
      </div>
    )
  }

  return (
    <div className="SudokuBoard">
      <table className="game__board">
        <tbody>
        {
          rows.map((row) => {
            return (
              <tr className="row" key={row}>
                {
                rows.map((col) => {
                  return(
                    <td className="Cell" key={col}>{cell(row, col)}</td>
                  )
                })
                }
              </tr>
            )
          })
        }
        </tbody>
      </table>
      <button className="SolveButton">
        Solve
      </button>
    </div>
  );
}
