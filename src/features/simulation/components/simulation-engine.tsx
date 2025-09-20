import { useState, useRef, useEffect, useCallback } from 'react';
import type Simulation from '../models/simulation';
import SimulationView from './simulation-view';
import BallSimulation from '@/simulations/ball-simulation/ball-simulation';
import useEventListener from '../hooks/use-event-listener';
import SimulationManagers from './simulation-managers';

export default function SimulationEngine() {
  const [step, setStep] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const simulation = useRef<Simulation>(null);
  const interval = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    simulation.current = new BallSimulation(window);
  }, []);

  useEffect(() => {
    console.log(step);
    if (simulation.current) {
      simulation.current.update();
    }
  }, [step]);

  useEffect(() => {
    function clear() {
      if (!interval.current) return;

      clearInterval(interval.current);
    }

    if (running) {
      interval.current = setInterval(
        () => setStep((step) => step + 1),
        1000 / 10,
      );
      return clear;
    } else {
      clear();
    }
  }, [running]);

  useEventListener(
    'keypress',
    (event: KeyboardEvent) => {
      if (event.key === 's') {
        setStep(step + 1);
      }
    },
    [step],
  );

  const start = useCallback(() => setRunning(true), []);
  const stop = useCallback(() => setRunning(false), []);

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <SimulationManagers />
      <SimulationView simulation={simulation.current} step={step} />
    </>
  );
}
