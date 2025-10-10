import Canvas from '@/components/canvas/components/canvas';
import { memo, useEffect, useRef } from 'react';
import Simulation from '../models/simulation';
import InfoView from './views/info-view';

export interface Props {
  simulation: Simulation | null;
}

const SimulationView = memo(function SimulationView(props: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) {
      console.error('No canvas exists.');
      return;
    }
    Simulation.context = canvas.current.getContext('2d');
  }, []);

  const draw = (context: CanvasRenderingContext2D) => {
    if (!props.simulation) return;
    props.simulation.draw(context);
  };

  return (
    <>
      <InfoView />
      <Canvas canvas={canvas} draw={draw} />
    </>
  );
});

export default SimulationView;
