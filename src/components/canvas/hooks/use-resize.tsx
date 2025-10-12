import { useEffect } from 'react';

/**
 * Call this to fix blurry canvas rendering
 */
export default function useResize(
  canvas: HTMLCanvasElement | null,
  width: number,
  height: number,
) {
  useEffect(() => {
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // fix blurry canvas rendering
    // https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm
    const canvasScale = window.devicePixelRatio;
    canvas.width = width * canvasScale;
    canvas.height = height * canvasScale;

    // ensure all drawing operations are scaled
    context.scale(devicePixelRatio, devicePixelRatio);

    // scale back down to window dimensions
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }, [canvas, height, width]);
}
