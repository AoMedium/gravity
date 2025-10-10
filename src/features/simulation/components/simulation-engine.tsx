import { useRef, useEffect } from 'react';
import type Simulation from '../models/simulation';
import SimulationManagers from './simulation-managers';
import { useDispatch } from 'react-redux';
import {
  incrementFrame,
  incrementStep,
} from '@/state/simulation/simulation-slice';
import useInterval from '../hooks/use-interval';
import GravitySimulation from '@/simulations/gravity-simulation/gravity-simulation';
import SimulationView from './simulation-view';

export default function SimulationEngine() {
  const dispatch = useDispatch();

  const simulation = useRef<Simulation>(null);

  useEffect(() => {
    // simulation.current = new BallSimulation(window);
    simulation.current = new GravitySimulation(window);
    simulation.current.fps = 10;

    simulation.current.init();
  }, []);

  // TODO: need to check that step > frame
  useInterval(simulation.current, () => dispatch(incrementStep()), 20);
  useInterval(simulation.current, () => dispatch(incrementFrame()), 20);

  return (
    <>
      <SimulationManagers simulation={simulation.current} />
      <SimulationView simulation={simulation.current} />
    </>
  );
}
