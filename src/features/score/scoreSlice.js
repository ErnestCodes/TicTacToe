import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playerOneScore: 0,
  playerTwoScore: 0,
  easyScore: 0,
  mediumScore: 0,
};

export const scoreSlice = createSlice({
  name: "score",
  initialState,
  reducers: {
    setPlayerOneScore: (state) => {
      state.playerOneScore += 1;
    },
    setPlayerTwoScore: (state) => {
      state.playerTwoScore += 1;
    },
    setTrophyScoreEasy: (state) => {
      state.easyScore += 1;
    },
    setTrophyScoreMedium: (state) => {
      state.mediumScore += 1;
    },
    setReset: (state) => {
      state.playerOneScore = 0;
      state.playerTwoScore = 0;
    },
    setResetEasy: (state) => {
      state.easyScore = 0;
    },
    setResetMedium: (state) => {
      state.mediumScore = 0;
    },
  },
});

export const {
  setPlayerOneScore,
  setPlayerTwoScore,
  setReset,
  setResetMedium,
  setResetEasy,
  setTrophyScoreEasy,
  setTrophyScoreMedium,
} = scoreSlice.actions;
export default scoreSlice.reducer;
