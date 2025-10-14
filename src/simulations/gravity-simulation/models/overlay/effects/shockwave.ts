import Simulation from '@/features/simulation/simulation';
import Effect from '../effect';
import type Vector2 from '../../vector2';
import GravitySimulation from '@/simulations/gravity-simulation/gravity-simulation';
import Canvas from '@/simulations/gravity-simulation/utils/canvas';

export default class Shockwave extends Effect {
  private position: Vector2;
  private velocity: Vector2;

  private maxRadius: number;
  private radius: number = 0;
  private opacity: number = 0;

  constructor(
    maxFrame: number,
    position: Vector2,
    velocity: Vector2,
    maxRadius: number,
  ) {
    super(maxFrame);

    this.position = position;
    this.velocity = velocity;
    this.maxRadius = maxRadius;
  }

  public update() {
    if (this.isFinished) {
      GravitySimulation.effects.remove(this.id);
      return;
    }

    const ratio = this.frame / this.maxFrame;
    this.opacity = 1 - ratio;
    this.radius = this.maxRadius * ratio;

    this.position.add(this.velocity);

    this.increment();
  }

  public draw() {
    const camera = GravitySimulation.cameraController.getActiveItem();
    if (!camera) return;

    const c = Simulation.context;
    if (!c) return;

    const scale = camera.scale;

    const renderPosition: Vector2 = Canvas.getRenderPosition(
      this.position,
      camera,
    );

    // Cull: do not render if out of canvas bounds
    if (Canvas.isOutOfBounds(renderPosition)) {
      return;
    }

    c.beginPath();
    c.strokeStyle = '#aaa';
    c.globalAlpha = this.opacity;

    c.arc(
      renderPosition.x,
      renderPosition.y,
      this.radius * scale,
      0,
      2 * Math.PI,
    );
    c.stroke();
    c.closePath();

    c.globalAlpha = 1;
  }
}
