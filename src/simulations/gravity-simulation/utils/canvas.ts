import type Camera from '../controllers/camera/camera';
import Vector2 from '../models/vector2';

export default class Canvas {
  public static isOutOfBounds(position: Vector2): boolean {
    return (
      position.x < 0 ||
      position.x > innerWidth ||
      position.y < 0 ||
      position.y > innerHeight
    );
  }

  public static getRenderPosition(position: Vector2, camera: Camera): Vector2 {
    const renderPosition = Vector2.scale(
      Vector2.subtract(position, camera.position),
      camera.scale,
    );
    renderPosition.add(new Vector2(innerWidth / 2, innerHeight / 2));

    return renderPosition;
  }
}
