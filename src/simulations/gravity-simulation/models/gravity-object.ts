import GravitySimulation from '../gravity-simulation';
import { Calculations } from '../utils/calculations';
import { Canvas } from '../utils/canvas';
import Entity, { EntityAttributes, type EntityArgs } from './entity';
import Vector2 from './vector2';

export type GravityObjectArgs = EntityArgs & {
  mass: number;
  attributes: EntityAttributes;
};

export class GravityObject extends Entity {
  private _mass: number;
  public attributes: EntityAttributes;

  private _radius: number = 0;

  private _lastPos: Vector2[] = [];
  private _maxPosEntries: number = 20;

  private readonly MIN_DOT_SIZE: number = 2;
  private readonly MIN_TAG_OFFSET = this.MIN_DOT_SIZE * 3;

  // Threshold for when a new pos should be added
  private readonly DIAMOND_ANGLE_THRESHOLD: number =
    Calculations.radiansToDiamondAngle(Calculations.degreesToRadians(10));

  constructor(args: GravityObjectArgs) {
    super(args);
    this._mass = args.mass;
    this.attributes = args.attributes;
  }

  public update(): void {
    //if (!this.attributes.fixed) {
    this.position.add(this.velocity);
    //}
    this.gravitate(GravitySimulation.entities);
    this.updateRadiusByMass();

    const camera = GravitySimulation.controller.getActiveCamera();
    if (camera) {
      this.updatePosEntries(camera.scale);
    }
  }

  public draw(context: CanvasRenderingContext2D): void {
    const camera = GravitySimulation.controller.getActiveCamera();
    if (!camera) return;

    const scale = 1; // camera.scale;

    const renderPos: Vector2 = Calculations.calculateRenderPos(
      this.position,
      camera,
    );

    // Cull: do not render if out of canvas bounds
    if (Canvas.outOfBounds(renderPos)) {
      return;
    }

    const drawBody = () => {
      context.beginPath();
      context.fillStyle = this.attributes.primaryColor;

      if (this._radius * scale < this.MIN_DOT_SIZE) {
        context.arc(
          renderPos.x,
          renderPos.y,
          this.MIN_DOT_SIZE,
          0,
          2 * Math.PI,
        );
      } else {
        context.arc(
          renderPos.x,
          renderPos.y,
          this._radius * scale,
          0,
          2 * Math.PI,
        );
      }

      context.fill();
      context.closePath();
    };

    const drawText = () => {
      let tagOffset: Vector2 = new Vector2(
        this._radius * scale,
        this._radius * scale * 2,
      );

      if (tagOffset.x < this.MIN_TAG_OFFSET) {
        tagOffset = new Vector2(this.MIN_TAG_OFFSET, this.MIN_TAG_OFFSET * 2);
      }

      const indent: Vector2 = new Vector2(5, 10); // TODO: check if it is more performant to have unchanging function constants inside or outside loop

      context.beginPath();

      context.strokeStyle = '#000'; // Colors.Black;
      context.fillStyle = this.attributes.primaryColor; // Text color
      context.lineWidth = 3;
      context.strokeText(
        this.name,
        renderPos.x + tagOffset.x,
        renderPos.y + tagOffset.y,
      );
      context.lineWidth = 1;
      context.fillText(
        this.name,
        renderPos.x + tagOffset.x,
        renderPos.y + tagOffset.y,
      );

      context.fillText(
        '<TYPE>' + ' / ' + Math.round(this.mass),
        indent.x + renderPos.x + tagOffset.x,
        renderPos.y + tagOffset.y + indent.y,
      );
      context.fillText(
        '(' +
          Math.round(this.position.x) +
          ', ' +
          Math.round(this.position.y) +
          ')',
        indent.x + renderPos.x + tagOffset.x,
        renderPos.y + tagOffset.y + indent.y * 2,
      );

      context.closePath();
    };

    const drawTrail = () => {
      const trailNodeRadius = 2;
      let trailRenderPos: Vector2;

      context.beginPath();
      context.strokeStyle = this.attributes.primaryColor; // TODO: consider using gradients to ease transition
      context.fillStyle = this.attributes.primaryColor;
      context.lineWidth = 1;

      this._lastPos.forEach((pos) => {
        trailRenderPos = Calculations.calculateRenderPos(pos, camera);
        context.lineTo(trailRenderPos.x, trailRenderPos.y);
        context.fillRect(
          trailRenderPos.x - trailNodeRadius * 0.5,
          trailRenderPos.y - trailNodeRadius * 0.5,
          trailNodeRadius,
          trailNodeRadius,
        );
      });
      context.lineTo(renderPos.x, renderPos.y);
      context.stroke();
      context.closePath();
    };

    const draw = () => {
      drawTrail();
      drawBody();
      drawText();
    };

    draw();
  }

  private updateRadiusByMass(): void {
    if (this.mass < 1) {
      // delete
      //entities.splice(searchForEntity(this.id), 1); //perhaps implement queue to lessen calls
    } else {
      this._radius = Math.pow((3 * this.mass) / (Math.PI * 4), 1 / 3) * 0.1;
    }
  }

  private gravitate(entities: Entity[]): void {
    entities.forEach((entity) => {
      if (!(entity instanceof GravityObject) || this.id == entity.id) {
        return;
      }

      const a = Calculations.calculateAcceleration(
        Vector2.subtract(this.position, entity.position),
        (entity as GravityObject).mass,
      );
      this.velocity.add(a);
    });
  }

  private updatePosEntries(scale: number): void {
    const newPosEntry = (pos: Vector2): void => {
      if (this._lastPos.length > this._maxPosEntries - 1) {
        this._lastPos.splice(0, 1);
      }
      this._lastPos.push(pos.copy()); // Need to copy as simply pushing would pass by reference, resulting in the value changing
    };

    const passPosThreshold = (): boolean => {
      const scaledThreshold: number = 50 / scale;
      const lastPos1: Vector2 = this._lastPos[this._lastPos.length - 1]; // TODO: is there a better way of getting last element without removing (e.g: pop())
      const lastPos2: Vector2 = this._lastPos[this._lastPos.length - 2];

      // Calculate displacement for old: (last - 2ndLast), and new: (now - last)
      const oldDisplacement: Vector2 = Vector2.subtract(lastPos2, lastPos1);
      const newDisplacement: Vector2 = Vector2.subtract(
        lastPos1,
        this.position,
      );

      // Calculate the diamond angle between the two displacement vectors
      const displacementAngle: number = Math.abs(
        Calculations.toDiamondAngle(newDisplacement) -
          Calculations.toDiamondAngle(oldDisplacement),
      );

      if (
        newDisplacement.magnitude() > scaledThreshold ||
        displacementAngle > this.DIAMOND_ANGLE_THRESHOLD
      ) {
        return true;
      }
      return false;
    };

    if (this._lastPos.length < 2) {
      newPosEntry(this.position);
      return;
    }

    // Second if to check, as passPosThreshold requires at least one existing entry
    if (passPosThreshold()) {
      newPosEntry(this.position);
    }
  }

  public get mass() {
    return this._mass;
  }
  public set mass(mass: number) {
    this._mass = mass;
  }
}
