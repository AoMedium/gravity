import { createSlice } from '@reduxjs/toolkit';

interface SimulationState {
  step: number;
  frame: number;
  isRunning: boolean;
}

const initialState: SimulationState = {
  step: 0,
  frame: 0,
  isRunning: false,
};

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    incrementStep(state: SimulationState) {
      state.step++;
    },
    incrementFrame(state: SimulationState) {
      state.frame++;
    },
    start(state: SimulationState) {
      state.isRunning = true;
    },
    stop(state: SimulationState) {
      state.isRunning = false;
    },
  },
});

export const { incrementStep, incrementFrame, start, stop } =
  simulationSlice.actions;
export default simulationSlice.reducer;
