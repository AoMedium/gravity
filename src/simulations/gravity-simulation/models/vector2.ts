export default class Vector2 {
  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  public static add(v1: Vector2, v2: Vector2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  public add(v: Vector2) {
    this.x += v.x;
    this.y += v.y;
  }

  public static subtract(v1: Vector2, v2: Vector2) {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  public subtract(v: Vector2) {
    this.x -= v.x;
    this.y -= v.y;
  }

  public static scale(v: Vector2, scalar: number): Vector2 {
    return new Vector2(v.x * scalar, v.y * scalar);
  }

  public scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
  }

  public equals(v: Vector2): boolean {
    return this.x == v.x && this.y == v.y;
  }

  public dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalized(): Vector2 {
    return new Vector2(this.x / this.magnitude(), this.y / this.magnitude());
  }

  public static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
