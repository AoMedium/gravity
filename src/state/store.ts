import { configureStore } from '@reduxjs/toolkit';
import simulationSliceReducer from './simulation/simulation-slice';

export const store = configureStore({
  reducer: {
    simulation: simulationSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
