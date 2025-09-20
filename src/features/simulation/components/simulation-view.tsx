import Canvas from '@/components/canvas/components/canvas';
import { useEffect, useRef, useState } from 'react';
import draw from '../scripts/draw';
import useEventListener from '../hooks/use-event-listener';
import Simulation from '../models/simulation';

export default function SimulationView() {
  const [step, setStep] = useState<number>(0);
  const state = useRef(new Simulation());

  const [canvasDraw, setCanvasDraw] =
    useState<(context: CanvasRenderingContext2D) => void>();

  useEffect(() => {}, []);

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
    // Update
    if (state.current) {
      state.current.step();
    }

    setCanvasDraw(
      () =>
        function (context: CanvasRenderingContext2D) {
          draw(context, state.current);
        },
    );
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
