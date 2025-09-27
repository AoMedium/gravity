import Vector2 from './vector2';

export interface EntityArgs {
  name?: string;
  position?: Vector2;
  velocity?: Vector2;
}

export default abstract class Entity {
  public readonly id: number;
  public readonly name: string;
  public position: Vector2;
  public velocity: Vector2;

  constructor(args: EntityArgs) {
    this.id = Math.random();
    this.name = args.name || 'Unnamed Entity';
    this.position = args.position || Vector2.zero();
    this.velocity = args.velocity || Vector2.zero();
  }

  public abstract update(): void;
  public abstract draw(context: CanvasRenderingContext2D): void;
}

export class EntityAttributes {
  fixed?: boolean;
  orbit?: boolean;
  center?: string;
  distance?: number;
  primaryColor: string;

  constructor(attributesJson: EntityAttributes) {
    this.fixed = attributesJson.fixed || false;
    this.orbit = attributesJson.orbit || false;
    this.center = attributesJson.center || undefined;
    this.distance = attributesJson.distance || 0;
    this.primaryColor = attributesJson.primaryColor || '#fff';
  }
}
