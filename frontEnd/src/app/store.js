import { configureStore } from '@reduxjs/toolkit'
import sudokuStore from '../body/elements/sudoku_store.js'
import web3Store from '../web3_store.js'

export default configureStore({
  reducer: {
    sudoku: sudokuStore,
    web3: web3Store
  },
})