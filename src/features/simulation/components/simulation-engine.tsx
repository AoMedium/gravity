import { useRef, useEffect } from 'react';
import type Simulation from '../models/simulation';
import SimulationView from './simulation-view';
import BallSimulation from '@/simulations/ball-simulation/ball-simulation';
import SimulationManagers from './simulation-managers';
import { useDispatch } from 'react-redux';
import {
  incrementFrame,
  incrementStep,
} from '@/state/simulation/simulation-slice';
import useInterval from '../hooks/use-interval';

export default function SimulationEngine() {
  const dispatch = useDispatch();

  const simulation = useRef<Simulation>(null);

  useEffect(() => {
    simulation.current = new BallSimulation(window);
    simulation.current.fps = 10;
  }, []);

  useInterval(simulation.current, () => dispatch(incrementStep()), 10);
  useInterval(simulation.current, () => dispatch(incrementFrame()), 1);

  return (
    <>
      <SimulationManagers simulation={simulation.current} />
      <SimulationView simulation={simulation.current} />
    </>
  );
}
