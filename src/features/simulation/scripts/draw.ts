export interface DrawProps {
  step: number;
}

export default function draw(
  context: CanvasRenderingContext2D,
  { step }: DrawProps,
) {
  console.log(step);
  if (!context) return;

  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  context.fillStyle = 'rgba(255, 0, 0, 0.5)';
  context.fillRect(step, step, 10, 10);
}
