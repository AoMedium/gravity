import type { RootState } from '@/state/store';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

interface CanvasProps {
  draw: ((ctx: CanvasRenderingContext2D) => void) | undefined;
  width: number;
  height: number;
}

export default function Canvas(props: CanvasProps) {
  const frame = useSelector((state: RootState) => state.simulation.frame);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Get the canvas and its 2D rendering context.
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    if (!props.draw) return;

    props.draw(context);
  }, [props, props.draw, frame]);

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}
