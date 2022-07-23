import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playerOneScore: 0,
  playerTwoScore: 0,
  trophyScore: 0,
};

export const scoreSlice = createSlice({
  name: "gameScore",
  initialState,
  reducers: {
    setPlayerOneScore: (state, action) => {
      state.playerOneScore += 1;
    },
    setPlayerTwoScore: (state, action) => {
      state.playerTwoScore += 1;
    },
    setTrophyScore: (state, action) => {
      state.trophyScore += 1;
    },
    setReset: (state, action) => {
      state.playerOneScore = 0;
      state.playerTwoScore = 0;
      state.trophyScore = 0;
    },
  },
});

export const { setPlayerOneScore, setPlayerTwoScore, setReset } =
  scoreSlice.actions;
export default scoreSlice.reducer;
