import type { EntityDTO } from '../dto/entity-dto';
import Vector2 from '../vector2';

export default abstract class Entity {
  public readonly id: number;
  public readonly name: string;
  public position: Vector2;
  public velocity: Vector2;

  constructor(entity: EntityDTO) {
    this.id = Math.random();
    this.name = entity.name || 'Unnamed Entity';
    this.position = entity.position
      ? new Vector2(entity.position.x, entity.position.y)
      : Vector2.zero();
    this.velocity = entity.velocity
      ? new Vector2(entity.velocity.x, entity.velocity.y)
      : Vector2.zero();
  }

  public abstract update(): void;
  public abstract draw(): void;
}
