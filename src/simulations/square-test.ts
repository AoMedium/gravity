import type Simulation from '../features/simulation/models/simulation';

export default class SquareTest implements Simulation {
  x: number;
  y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }

  public update(): void {
    this.x++;
    this.y++;
  }

  public draw(context: CanvasRenderingContext2D): void {
    if (!context) return;

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    context.fillStyle = 'rgba(255, 0, 0, 0.5)';
    context.fillRect(this.x, this.y, 10, 10);
  }
}
