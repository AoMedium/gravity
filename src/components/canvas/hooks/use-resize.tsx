export default function useResize(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  // fix blurry canvas rendering
  // https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm
  const canvasScale = window.devicePixelRatio;
  canvas.width = window.innerWidth * canvasScale;
  canvas.height = window.innerHeight * canvasScale;

  // ensure all drawing operations are scaled
  context.scale(devicePixelRatio, devicePixelRatio);

  // scale back down to window dimensions
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
}
