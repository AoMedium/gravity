import type { RootState } from '@/state/store';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useResize from '../hooks/use-resize';

interface CanvasProps {
  draw: ((ctx: CanvasRenderingContext2D) => void) | undefined;
}

export default function Canvas(props: CanvasProps) {
  const frame = useSelector((state: RootState) => state.simulation.frame);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useResize(canvasRef.current);

  useEffect(() => {
    // Get the canvas and its 2D rendering context.
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    if (!props.draw) return;

    props.draw(context);
  }, [props, props.draw, frame]);

  return <canvas ref={canvasRef} />;
}
