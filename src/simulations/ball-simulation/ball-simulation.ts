import Simulation from '@/features/simulation/models/simulation';
import type { Ball } from './models/ball';

export default class BallSimulation extends Simulation {
  public init(): void {}
  public handleInput(key: string): void {
    console.log(key);
  }
  ball: Ball;

  constructor(window: Window) {
    super(window);

    this.ball = {
      x: 50,
      y: 50,
      radius: 15,
      dx: 3, // velocity on the x-axis
      dy: 3, // velocity on the y-axis
    };
  }

  public update(): void {
    // Update the this.ball's position.
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // Check for wall collisions and reverse direction.
    if (
      this.ball.x + this.ball.radius > this.window.innerWidth ||
      this.ball.x - this.ball.radius < 0
    ) {
      this.ball.dx = -this.ball.dx;
    }
    if (
      this.ball.y + this.ball.radius > this.window.innerHeight ||
      this.ball.y - this.ball.radius < 0
    ) {
      this.ball.dy = -this.ball.dy;
    }
  }

  public draw(context: CanvasRenderingContext2D): void {
    if (!context) return;

    context.clearRect(0, 0, this.window.innerWidth, this.window.innerHeight);

    // Draw the this.ball.
    context.beginPath();
    context.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    context.fillStyle = '#6366f1';
    context.fill();
    context.closePath();
  }
}
