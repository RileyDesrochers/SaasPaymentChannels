import { createSlice } from '@reduxjs/toolkit'

export const sudokuStore = createSlice({
  name: 'sudoku',
  initialState: {
    value: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  reducers: {
    fillCell: (state, action) => {
      state.value[action.payload[0]][action.payload[1]] = parseInt(action.payload[2]);
    }
  },
})

// Action creators are generated for each case reducer function
export const { fillCell } = sudokuStore.actions

export default sudokuStore.reducer