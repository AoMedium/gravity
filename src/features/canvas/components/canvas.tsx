import { useRef, useEffect } from 'react';
import useResize from '../hooks/useResize';

interface CanvasProps {
  draw: (ctx: CanvasRenderingContext2D) => void;
  // Any other properties to pass down to the canvas element, such as className or id.
  [key: string]: any;
}

export default function Canvas({ draw, ...props }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // useResize(canvasRef.current);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    draw(context);

    // This effect re-runs whenever the 'draw' function or other props change.
    // If the draw function is created on every render, it will cause
    // this effect to run unnecessarily. Consider using React.useCallback
    // for the draw function in the parent component to memoize it.
  }, [draw, props]);

  return (
    <canvas
      ref={canvasRef}
      {...props}
      className="rounded-lg shadow-lg w-full h-full border-2 border-gray-300"
    />
  );
}
