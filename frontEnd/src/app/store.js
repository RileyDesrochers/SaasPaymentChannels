import { configureStore } from '@reduxjs/toolkit'
import web3Store from '../web3_store.js'

export default configureStore({
  reducer: {
    web3: web3Store
  },
})