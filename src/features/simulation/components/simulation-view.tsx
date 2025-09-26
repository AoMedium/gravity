import Canvas from '@/components/canvas/components/canvas';
import { memo, useEffect, useState } from 'react';
import type Simulation from '../models/simulation';
import type { RootState } from '@/state/store';
import { useSelector } from 'react-redux';

export interface Props {
  simulation: Simulation | null;
}

const SimulationView = memo(function SimulationView(props: Props) {
  const step = useSelector((state: RootState) => state.simulation.step);

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
  }, [props.simulation, step]);

  return (
    <>
      <Canvas
        draw={canvasDraw}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
});

export default SimulationView;
