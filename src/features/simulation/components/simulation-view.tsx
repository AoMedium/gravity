import Canvas from '@/components/canvas/components/canvas';
import { memo, useEffect, useRef } from 'react';
import Simulation from '../simulation';
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

  useEffect(() => {
    if (!canvas.current) return;

    /**
     * The ref value 'canvas.current' will likely have changed by the time
     * this effect cleanup function runs.
     *
     * If this ref points to a node rendered by React,
     * copy 'canvas.current' to a variable inside the effect,
     * and use that variable in the cleanup function.
     */
    const canvasRef = canvas.current;

    const handleMousedown = (event: MouseEvent) => {
      Simulation.inputHandler.mousedown(event);
    };

    canvasRef.addEventListener('mousedown', handleMousedown);

    return () => {
      if (canvasRef) {
        canvasRef.removeEventListener('mousedown', handleMousedown);
      }
    };
  }, [canvas]);

  const draw = (context: CanvasRenderingContext2D) => {
    if (!props.simulation) return;
    props.simulation.draw(context);
  };

  return (
    <>
      <Canvas canvas={canvas} draw={draw} />
      <InfoView />
    </>
  );
});

export default SimulationView;
