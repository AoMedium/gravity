import type Simulation from '../models/simulation';

export default function draw(
  context: CanvasRenderingContext2D,
  simulation: Simulation,
) {
  if (!context) return;

  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  context.fillStyle = 'rgba(255, 0, 0, 0.5)';
  context.fillRect(simulation.x, simulation.y, 10, 10);
}
