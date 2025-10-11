import type Entity from '../../models/entity/entity';
import Vector2 from '../../models/vector2';

export default class Camera {
  private _id: number;
  public position: Vector2;
  public velocity: Vector2 = Vector2.zero();
  private _scale: number = 1;

  private _useSmoothMovement: boolean = true;

  public target: Entity | undefined;

  // Drag for smooth movement
  private readonly drag: number = 0.1;
  // Scaled amount to move when useSmoothMovement is disabled
  private readonly staticMoveFactor = 20;

  constructor(position?: Vector2) {
    this._id = Math.random();
    this.position = position || Vector2.zero();
  }

  public update(): void {
    if (this.target) {
      this.position = this.target.position.copy(); // Create new Vector2 rather than assign, as position is a ref
    } else {
      this.updateVelocity();
    }
  }

  public toggleSmoothMovement(): void {
    this._useSmoothMovement = !this._useSmoothMovement;
  }

  public get id() {
    return this._id;
  }
  public get scale() {
    return this._scale;
  }
  public set scale(scale: number) {
    if (scale <= 0) {
      console.error('Cannot have a scale less than 0');
      return;
    }
    this._scale = scale;
  }

  public clearTarget() {
    this.target = undefined;
  }

  private updateVelocity() {
    if (this.velocity.equals(Vector2.zero())) {
      return;
    }

    if (this._useSmoothMovement) {
      // Limit how small the velocity can go, based on scale
      if (this.velocity.magnitude() < this.drag / this._scale) {
        this.velocity = Vector2.zero();
      } else {
        this.velocity.scale(1 - this.drag);
      }

      this.position.add(this.velocity);
    } else {
      this.position.add(Vector2.scale(this.velocity, this.staticMoveFactor));
      this.velocity = Vector2.zero();
    }
  }
}
