import Canvas from '@/components/canvas/components/canvas';
import { useEffect, useRef, useState } from 'react';
import useEventListener from '../hooks/use-event-listener';
import type Simulation from '../models/simulation';
import BallSimulation from '@/simulations/ball-simulation/ball-simulation';

export default function SimulationView() {
  const [step, setStep] = useState<number>(0);
  const state = useRef<Simulation>(null);

  const [canvasDraw, setCanvasDraw] =
    useState<(context: CanvasRenderingContext2D) => void>();

  useEffect(() => {
    state.current = new BallSimulation(window);
  }, []);

  useEventListener(
    'keypress',
    (event: KeyboardEvent) => {
      if (event.key === 's') {
        setStep(step + 1);
      }
    },
    [step],
  );

  useEffect(() => {
    if (state.current) {
      state.current.update();

      setCanvasDraw(
        () =>
          function (context: CanvasRenderingContext2D) {
            if (!state.current) return;
            state.current.draw(context);
          },
      );
    }
  }, [step]);

  return (
    <>
      <Canvas
        draw={canvasDraw}
        width={window.innerWidth}
        height={window.innerHeight}
      ></Canvas>
    </>
  );
}
