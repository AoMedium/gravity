import { useRef, useEffect } from 'react';

interface CanvasProps {
  draw: ((ctx: CanvasRenderingContext2D) => void) | undefined;
  width: number;
  height: number;
  // Any other properties to pass down to the canvas element, such as className or id.
  [key: string]: any;
}

export default function Canvas({ draw, width, height, ...props }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // useResize(canvasRef.current);

  useEffect(() => {
    // Get the canvas and its 2D rendering context.
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!draw) return;

    draw(ctx);

    // The effect runs only once when the component mounts.
  }, [draw, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      {...props}
      className="rounded-lg shadow-lg w-full h-full border-2 border-gray-300"
    />
  );
}
