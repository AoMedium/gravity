import Simulation from '@/features/simulation/simulation';
import type Vector2 from '../../../vector2';

export default class Cursor {
  public static draw(
    position: Vector2,
    radius: number,
    color: string | CanvasGradient | CanvasPattern,
  ) {
    const c = Simulation.context;
    if (!c) return;

    c.strokeStyle = color;

    c.beginPath();

    c.arc(position.x, position.y, radius, -Math.PI * 0.5, 0);
    c.stroke();
    c.beginPath();
    c.arc(position.x, position.y, radius, Math.PI * 0.5, Math.PI);
    c.stroke();

    c.closePath();
  }
}
