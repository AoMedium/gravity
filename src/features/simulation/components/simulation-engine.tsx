import { useRef, useEffect } from 'react';
import type Simulation from '../models/simulation';
import SimulationView from './simulation-view';
import BallSimulation from '@/simulations/ball-simulation/ball-simulation';
import SimulationManagers from './simulation-managers';
import type { RootState } from '@/state/store';
import { useSelector, useDispatch } from 'react-redux';
import { increment } from '@/state/simulation/simulation-slice';

export default function SimulationEngine() {
  const dispatch = useDispatch();

  const isRunning = useSelector(
    (state: RootState) => state.simulation.isRunning,
  );

  const simulation = useRef<Simulation>(null);
  const interval = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    simulation.current = new BallSimulation(window);
    simulation.current.fps = 10;
  }, []);

  useEffect(() => {
    function clear() {
      if (!interval.current) return;
      clearInterval(interval.current);
    }

    if (!simulation.current) return;

    if (isRunning) {
      interval.current = setInterval(
        () => dispatch(increment()),
        1000 / simulation.current.fps,
      );
      return clear;
    } else {
      clear();
    }
  }, [dispatch, isRunning]);

  return (
    <>
      <SimulationManagers simulation={simulation.current} />
      <SimulationView simulation={simulation.current} />
    </>
  );
}
