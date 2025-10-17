import type Camera from '../controllers/camera/camera';
import Vector2 from '../models/vector2';

export default class Canvas {
  public static isOutOfBounds(position: Vector2) {
    return (
      position.x < 0 ||
      position.x > innerWidth ||
      position.y < 0 ||
      position.y > innerHeight
    );
  }

  public static getRenderPosition(position: Vector2, camera: Camera) {
    const renderPosition = Vector2.scale(
      Vector2.subtract(position, camera.position),
      camera.scale,
    );

    renderPosition.y *= -1; // As canvas draws from top to bottom, invert y-axis so that y increases bottom to top

    renderPosition.add(new Vector2(innerWidth / 2, innerHeight / 2)); // Move origin (0,0) to centre of canvas

    return renderPosition;
  }

  public static getPhysicalPosition(renderPosition: Vector2, camera: Camera) {
    renderPosition.subtract(new Vector2(innerWidth / 2, innerHeight / 2)); // Move origin (0,0) to centre of canvas

    renderPosition.y *= -1; // As canvas draws from top to bottom, invert y-axis so that y increases bottom to top

    renderPosition.scale(1 / camera.scale);

    const position = Vector2.add(renderPosition, camera.position);

    return position;
  }

  public static clear(c: CanvasRenderingContext2D) {
    c.clearRect(0, 0, innerWidth, innerHeight); // TODO: innerWidth vs window.innerWidth
  }

  public static drawText(
    c: CanvasRenderingContext2D,
    text: CanvasText,
    position: Vector2,
  ) {
    if (text.bold) {
      c.fillStyle = text.fillColor || '#fff';
      c.strokeStyle = text.strokeColor || '#000';

      c.lineWidth = 3;

      c.beginPath();
      c.strokeText(text.value, position.x, position.y);
      c.closePath();

      c.lineWidth = 1;
    }

    c.fillText(text.value, position.x, position.y);
  }
}

export class CanvasText {
  value: string = '';
  strokeColor?: string | CanvasGradient | CanvasPattern;
  fillColor?: string | CanvasGradient | CanvasPattern;
  bold?: boolean;
}
