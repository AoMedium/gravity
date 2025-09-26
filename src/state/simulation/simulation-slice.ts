import { createSlice } from '@reduxjs/toolkit';

interface SimulationState {
  step: number;
}

const initialState: SimulationState = {
  step: 0,
};

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    increment(state: SimulationState) {
      state.step++;
    },
  },
});

export const { increment } = simulationSlice.actions;
export default simulationSlice.reducer;
