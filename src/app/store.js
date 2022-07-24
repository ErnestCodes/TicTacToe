import { combineReducers, configureStore } from "@reduxjs/toolkit";
import scoreSlice from "../features/score/scoreSlice";

const reducer = combineReducers({
  score: scoreSlice,
});

export const store = configureStore({
  reducer: reducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
});
