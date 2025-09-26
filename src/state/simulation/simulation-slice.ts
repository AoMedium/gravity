import { createSlice } from '@reduxjs/toolkit';

interface SimulationState {
  step: number;
  isRunning: boolean;
}

const initialState: SimulationState = {
  step: 0,
  isRunning: false,
};

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    increment(state: SimulationState) {
      state.step++;
    },
    start(state: SimulationState) {
      state.isRunning = true;
    },
    stop(state: SimulationState) {
      state.isRunning = false;
    },
  },
});

export const { increment, start, stop } = simulationSlice.actions;
export default simulationSlice.reducer;
