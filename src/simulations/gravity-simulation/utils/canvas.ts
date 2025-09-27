import type Vector2 from '../models/vector2';

export class Canvas {
  public static outOfBounds(pos: Vector2): boolean {
    return pos.x < 0 || pos.x > innerWidth || pos.y < 0 || pos.y > innerHeight;
  }
}
