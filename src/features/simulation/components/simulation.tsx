import Canvas from '@/components/canvas/components/canvas';
import { useEffect, useState } from 'react';
import draw from '../scripts/draw';
import useEventListener from '../hooks/useEventListener';

export default function Simulation() {
  const [step, setStep] = useState<number>(0);
  const [canvasDraw, setCanvasDraw] = useState<
    (context: CanvasRenderingContext2D) => void
  >(() => function (context: CanvasRenderingContext2D) {});

  useEffect(() => {}, []);

  useEventListener(
    'keypress',
    (event: KeyboardEvent) => {
      if (event.key === 's') {
        setStep(step + 1);
        console.log('step', step);
      }
    },
    [step],
  );

  useEffect(() => {
    // Update

    setCanvasDraw(
      () =>
        function (context: CanvasRenderingContext2D) {
          draw(context, { step: step });
        },
    );
  }, [step]);

  return (
    <>
      <Canvas
        draw={canvasDraw}
        step={step}
        width={window.innerWidth}
        height={window.innerHeight}
      ></Canvas>
    </>
  );
}
