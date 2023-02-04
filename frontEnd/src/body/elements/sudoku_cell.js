import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fillCell } from './sudoku_store.js'

function SudokuCell(props) {
    const sudoku = useSelector((state) => state.sudoku.value);
    const dispatch = useDispatch();

    return (
        <div className="SudokuCell">
            <select name="cell" id="cell" value={sudoku[props.coords[0]][props.coords[1]]} onChange={value => dispatch(fillCell([props.coords[0], props.coords[1], value.target.value]))}>
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
    );
}

export default SudokuCell;
