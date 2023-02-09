import { createSlice } from '@reduxjs/toolkit'

export const web3Store = createSlice({
  name: 'web3',
  initialState: {
    Balance: '0',
    Channels: []
  },
  reducers: {
    setBal: (state, action) => {
      state.Balance = action.payload;
    },
    setChannels: (state, action) => {
      state.Channels = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setBal, setChannels } = web3Store.actions

export default web3Store.reducer