import Vector2 from './vector2';

export default class Camera {
  private _id: number;
  private _position: Vector2;
  private _velocity: Vector2 = Vector2.zero();
  private _scale: number = 1;

  private _useSmoothMovement: boolean = false;

  // Drag for smooth movement
  private readonly drag: number = 0.01;
  // Scaled amount to move when useSmoothMovement is disabled
  private readonly staticMoveFactor = 20;

  constructor(position?: Vector2) {
    this._id = Math.random();
    this._position = position || Vector2.zero();
  }

  public update(): void {
    if (this._velocity.equals(Vector2.zero())) {
      return;
    }

    if (this._useSmoothMovement) {
      // Limit how small the velocity can go, based on scale
      if (this._velocity.magnitude() < this.drag / this._scale) {
        this._velocity = Vector2.zero();
      } else {
        this._velocity.scale(1 - this.drag);
      }

      this._position.add(this._velocity);
    } else {
      this._position.add(Vector2.scale(this._velocity, this.staticMoveFactor));
      this._velocity = Vector2.zero();
    }
  }

  public toggleSmoothMovement(): void {
    this._useSmoothMovement = !this._useSmoothMovement;
  }

  get id() {
    return this._id;
  }

  get position() {
    return this._position;
  }
  set position(position: Vector2) {
    this._position = position;
  }

  get velocity() {
    return this._velocity;
  }
  set velocity(velocity: Vector2) {
    this._position = velocity;
  }

  get scale() {
    return this._scale;
  }
  set scale(scale: number) {
    if (scale <= 0) {
      console.error('Cannot have a scale less than 0');
      return;
    }
    this._scale = scale;
  }
}
