import type { RootState } from '@/state/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useResize from '../hooks/use-resize';

const allowResizing = false;

interface CanvasProps {
  canvas: React.RefObject<HTMLCanvasElement | null>;
  draw: ((ctx: CanvasRenderingContext2D) => void) | undefined;
}

export default function Canvas(props: CanvasProps) {
  const frame = useSelector((state: RootState) => state.simulation.frame);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    if (!allowResizing) return;

    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      console.log('resize');
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // TODO: apply resize rerender only after a few seconds to avoid rerendering during resizing
  // TODO: see if its possible to freeze-frame while resizing to avoid flickering
  useResize(props.canvas.current, width, height);

  useEffect(() => {
    // Get the canvas and its 2D rendering context.
    const canvas = props.canvas.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    if (!props.draw) return;

    props.draw(context);
  }, [props, props.draw, frame]);

  return (
    <canvas
      ref={props.canvas}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -10,
      }}
    />
  );
}
