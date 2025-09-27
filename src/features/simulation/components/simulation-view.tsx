import Canvas from '@/components/canvas/components/canvas';
import { memo, useCallback, useEffect, useState } from 'react';
import type Simulation from '../models/simulation';
import type { RootState } from '@/state/store';
import { useSelector } from 'react-redux';

export interface Props {
  simulation: Simulation | null;
}

const SimulationView = memo(function SimulationView(props: Props) {
  const frame = useSelector((state: RootState) => state.simulation.frame);

  const [draw, setDraw] =
    useState<(context: CanvasRenderingContext2D) => void>();

  const drawFrame = useCallback(() => {
    setDraw(
      () =>
        function (context: CanvasRenderingContext2D) {
          if (!props.simulation) return;
          props.simulation.draw(context);
        },
    );
  }, [props.simulation]);

  // useEffect(() => {
  //   console.log('frame:', frame);
  // }, [frame]);

  useEffect(() => {
    setDraw(drawFrame);
  }, [drawFrame, frame]); // TODO: fix why this renders Simulation View twice

  return (
    <>
      <Canvas
        draw={draw}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
});

export default SimulationView;
