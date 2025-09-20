import Canvas from '@/components/canvas/components/canvas';
import { useEffect, useState } from 'react';
import type Simulation from '../models/simulation';

export interface SimulationViewProps {
  simulation: Simulation | null;
  step: number;
}

export default function SimulationView(props: SimulationViewProps) {
  const [canvasDraw, setCanvasDraw] =
    useState<(context: CanvasRenderingContext2D) => void>();

  useEffect(() => {
    setCanvasDraw(
      () =>
        function (context: CanvasRenderingContext2D) {
          if (!props.simulation) return;
          props.simulation.draw(context);
        },
    );
  }, [props.step]);

  return (
    <>
      <Canvas
        draw={canvasDraw}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
}
