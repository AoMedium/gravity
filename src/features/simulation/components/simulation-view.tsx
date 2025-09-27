import Canvas from '@/components/canvas/components/canvas';
import { memo } from 'react';
import type Simulation from '../models/simulation';

export interface Props {
  simulation: Simulation | null;
}

const SimulationView = memo(function SimulationView(props: Props) {
  const draw = (context: CanvasRenderingContext2D) => {
    if (!props.simulation) return;
    props.simulation.draw(context);
  };

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
