import Simulation from '@/features/simulation/models/simulation';
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

  private _previousPositions: Vector2[] = [];
  private _maxPosEntries: number = 20;

  private readonly MIN_DOT_SIZE: number = 2;
  private readonly MIN_TAG_OFFSET = this.MIN_DOT_SIZE * 3;

  // Threshold for when a new position should be added
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
    this.gravitate();
    this.updateRadiusByMass();

    const camera = GravitySimulation.controller.getActiveCamera();
    if (camera) {
      this.updateRecordedPositions(camera.scale);
    }
  }

  public draw(): void {
    const camera = GravitySimulation.controller.getActiveCamera();
    if (!camera) return;

    const c = Simulation.context;
    if (!c) return;

    const scale = camera.scale;

    const renderPosition: Vector2 = Calculations.calculateRenderPos(
      this.position,
      camera,
    );

    // Cull: do not render if out of canvas bounds
    if (Canvas.isOutOfBounds(renderPosition)) {
      return;
    }

    const drawBody = () => {
      c.beginPath();
      c.fillStyle = this.attributes.primaryColor;

      if (this._radius * scale < this.MIN_DOT_SIZE) {
        c.arc(
          renderPosition.x,
          renderPosition.y,
          this.MIN_DOT_SIZE,
          0,
          2 * Math.PI,
        );
      } else {
        c.arc(
          renderPosition.x,
          renderPosition.y,
          this._radius * scale,
          0,
          2 * Math.PI,
        );
      }

      c.fill();
      c.closePath();
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

      c.beginPath();

      c.strokeStyle = '#000'; // Colors.Black;
      c.fillStyle = this.attributes.primaryColor; // Text color
      c.lineWidth = 3;
      c.strokeText(
        this.name,
        renderPosition.x + tagOffset.x,
        renderPosition.y + tagOffset.y,
      );
      c.lineWidth = 1;
      c.fillText(
        this.name,
        renderPosition.x + tagOffset.x,
        renderPosition.y + tagOffset.y,
      );

      c.fillText(
        `<TYPE> / ${Math.round(this.mass)}`,
        indent.x + renderPosition.x + tagOffset.x,
        renderPosition.y + tagOffset.y + indent.y,
      );
      c.fillText(
        `(${Math.round(this.position.x)}, ${Math.round(this.position.y)})`,
        indent.x + renderPosition.x + tagOffset.x,
        renderPosition.y + tagOffset.y + indent.y * 2,
      );

      c.closePath();
    };

    const drawTrail = () => {
      const trailNodeRadius = 2;
      let trailRenderPos: Vector2;

      c.beginPath();
      c.strokeStyle = this.attributes.primaryColor; // TODO: consider using gradients to ease transition
      c.fillStyle = this.attributes.primaryColor;
      c.lineWidth = 1;

      for (let i = 0; i < this._previousPositions.length; i++) {
        const position = this._previousPositions[i];
        trailRenderPos = Calculations.calculateRenderPos(position, camera);
        c.lineTo(trailRenderPos.x, trailRenderPos.y);
        c.fillRect(
          trailRenderPos.x - trailNodeRadius * 0.5,
          trailRenderPos.y - trailNodeRadius * 0.5,
          trailNodeRadius,
          trailNodeRadius,
        );
      }
      c.lineTo(renderPosition.x, renderPosition.y);
      c.stroke();
      c.closePath();
    };

    const draw = () => {
      drawTrail();
      drawBody();
      drawText();
    };

    draw();
  }

  private updateRadiusByMass(): void {
    // TODO: check if mass has changed to avoid recalculated if not needed
    if (this.mass < 1) {
      // delete
      //entities.splice(searchForEntity(this.id), 1); //perhaps implement queue to lessen calls
    } else {
      this._radius = Math.pow((3 * this.mass) / (Math.PI * 4), 1 / 3) * 0.1;
    }
  }

  private gravitate(): void {
    for (let i = 0; i < GravitySimulation.entities.length; i++) {
      const entity = GravitySimulation.entities[i];

      if (!(entity instanceof GravityObject) || this.id == entity.id) {
        return;
      }

      const acceleration = Calculations.calculateAcceleration(
        Vector2.subtract(this.position, entity.position),
        (entity as GravityObject).mass,
      );
      this.velocity.add(acceleration);
    }
  }

  private updateRecordedPositions(scale: number): void {
    const recordNewPosition = (position: Vector2): void => {
      if (this._previousPositions.length > this._maxPosEntries - 1) {
        this._previousPositions.splice(0, 1);
      }
      this._previousPositions.push(position.copy()); // Need to copy as simply pushing would pass by reference, resulting in the value changing
    };

    const hasExceededPositionThreshold = (): boolean => {
      const scaledThreshold: number = 50 / scale;
      const lastPosition1: Vector2 =
        this._previousPositions[this._previousPositions.length - 1]; // TODO: is there a better way of getting last element without removing (e.g: pop())
      const lastPosition2: Vector2 =
        this._previousPositions[this._previousPositions.length - 2];

      // Calculate displacement for old: (last - 2ndLast), and new: (now - last)
      const oldDisplacement: Vector2 = Vector2.subtract(
        lastPosition2,
        lastPosition1,
      );
      const newDisplacement: Vector2 = Vector2.subtract(
        lastPosition1,
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

    if (this._previousPositions.length < 2) {
      recordNewPosition(this.position);
      return;
    }

    // Second if to check, as passPosThreshold requires at least one existing entry
    if (hasExceededPositionThreshold()) {
      recordNewPosition(this.position);
    }
  }

  public get mass() {
    return this._mass;
  }
  public set mass(mass: number) {
    this._mass = mass;
  }
}
