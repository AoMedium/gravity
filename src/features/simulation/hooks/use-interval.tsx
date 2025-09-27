import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type Simulation from '../models/simulation';
import type { RootState } from '@/state/store';

export default function useInterval(
  simulation: Simulation | null,
  callback: () => void,
  delay?: number,
) {
  const dispatch = useDispatch();

  const isRunning = useSelector(
    (state: RootState) => state.simulation.isRunning,
  );

  const interval = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    function clear() {
      if (!interval.current) return;
      clearInterval(interval.current);
    }

    if (!simulation) return;

    if (isRunning) {
      const fps = delay ? delay : simulation.fps;
      interval.current = setInterval(callback, 1000 / fps);
      return clear;
    } else {
      clear();
    }
  }, [callback, delay, dispatch, isRunning, simulation]);
}
