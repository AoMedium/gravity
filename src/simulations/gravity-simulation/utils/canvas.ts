import type Vector2 from '../models/vector2';

export default class Canvas {
  public static isOutOfBounds(position: Vector2): boolean {
    return (
      position.x < 0 ||
      position.x > innerWidth ||
      position.y < 0 ||
      position.y > innerHeight
    );
  }
}
