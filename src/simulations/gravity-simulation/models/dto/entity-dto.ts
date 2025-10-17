import type Vector2 from '../vector2';

export interface EntityDTO {
  name: string;
  position: Vector2;
  velocity?: Vector2;
}
