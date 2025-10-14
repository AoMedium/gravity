import Simulation from '@/features/simulation/simulation';
import GravitySimulation from '../../gravity-simulation';
import Calculations from '../../utils/calculations';
import Canvas from '../../utils/canvas';
import type GravityObjectDTO from '../dto/gravity-object-dto';
import Vector2 from '../vector2';
import Entity from './entity';
import { EntityAttributes } from './entity-attributes';
import Shockwave from '../overlay/effects/shockwave';

export default class GravityObject extends Entity {
  private _mass: number;
  public attributes: EntityAttributes;

  public radius: number = 0;

  private _previousPositions: Vector2[] = [];
  private _maxPosEntries: number = 20;

  private readonly MIN_DOT_SIZE: number = 2;
  private readonly MIN_TAG_OFFSET = this.MIN_DOT_SIZE * 3;

  // Threshold for when a new position should be added
  private readonly DIAMOND_ANGLE_THRESHOLD: number =
    Calculations.radiansToDiamondAngle(Calculations.degreesToRadians(10));

  constructor(gravityObject: GravityObjectDTO) {
    super(gravityObject);
    this._mass = gravityObject.mass;
    this.attributes = new EntityAttributes(gravityObject.attributes);
  }

  public update(): void {
    if (!this.attributes.fixed) {
      this.position.add(this.velocity);
    }

    this.compare();
    this.updateRadiusByMass();

    const camera = GravitySimulation.cameraController.getActiveItem();
    if (camera) {
      this.updateRecordedPositions(camera.scale);
    }
  }

  public draw(): void {
    const camera = GravitySimulation.cameraController.getActiveItem();
    if (!camera) return;

    const c = Simulation.context;
    if (!c) return;

    const scale = camera.scale;

    const renderPosition: Vector2 = Canvas.getRenderPosition(
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

      if (this.radius * scale < this.MIN_DOT_SIZE) {
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
          this.radius * scale,
          0,
          2 * Math.PI,
        );
      }

      c.fill();
      c.closePath();
    };

    const drawText = () => {
      let tagOffset: Vector2 = new Vector2(
        this.radius * scale,
        this.radius * scale * 2,
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
      if (this._previousPositions.length < 1) {
        return;
      }

      const trailNodeRadius = 2;

      // TODO: consider using gradients to ease transition
      c.strokeStyle = this.attributes.primaryColor;
      c.fillStyle = this.attributes.primaryColor;
      c.lineWidth = 1;

      let trailPosition: Vector2 | undefined;
      let nextTrailPosition: Vector2 | undefined;

      for (let i = 0; i < this._previousPositions.length - 1; i++) {
        trailPosition = Canvas.getRenderPosition(
          this._previousPositions[i],
          camera,
        );
        nextTrailPosition = Canvas.getRenderPosition(
          this._previousPositions[i + 1],
          camera,
        );

        // Change opacity depending on how old this position is
        c.globalAlpha = (i + 1) / this._previousPositions.length;

        c.beginPath();
        c.moveTo(trailPosition.x, trailPosition.y);
        c.lineTo(nextTrailPosition.x, nextTrailPosition.y);
        c.stroke();
        c.closePath();

        if (GravitySimulation.settings.showTrailNodes) {
          c.fillRect(
            trailPosition.x - trailNodeRadius * 0.5,
            trailPosition.y - trailNodeRadius * 0.5,
            trailNodeRadius,
            trailNodeRadius,
          );
        }

        // Reset opacity
        c.globalAlpha = 1;
      }

      // Draw line to current position
      if (nextTrailPosition) {
        c.beginPath();
        c.moveTo(nextTrailPosition.x, nextTrailPosition.y);
        c.lineTo(renderPosition.x, renderPosition.y);
        c.stroke();
        c.closePath();
      }
    };

    const draw = () => {
      if (GravitySimulation.settings.showTrails) drawTrail();
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
      this.radius = Math.pow((3 * this.mass) / (Math.PI * 4), 1 / 3) * 0.1;
    }
  }

  private compare() {
    for (let i = 0; i < GravitySimulation.entities.length; i++) {
      const object = GravitySimulation.entities.getIndex(i);

      if (!(object instanceof GravityObject) || this.id == object.id) {
        continue;
      }

      // TODO: cache calculation
      const separation = Vector2.subtract(
        this.position,
        object.position,
      ).magnitude();

      if (separation < object.radius + this.radius) {
        this.handleCollision(object);
      } else {
        this.gravitate(object);
      }
    }
  }

  private handleCollision(object: GravityObject) {
    if (this.mass < object.mass) return;

    switch (GravitySimulation.settings.collisionMode) {
      case 'absorb':
        if (!this.attributes.fixed) {
          //&& this.type != negative_matter) {

          const totalMomentum = Vector2.add(
            Vector2.scale(this.velocity, this.mass),
            Vector2.scale(object.velocity, object.mass),
          );

          this.velocity = Vector2.scale(
            totalMomentum,
            1 / (this.mass + object.mass),
          );
        }

        // if (
        //   this.type == negative_matter ||
        //   entities[i].type == negative_matter
        // ) {
        //   this.mass -= this.thatMass;
        // } else {
        this.mass += object.mass;
        // }

        // if (this.type == star && entities[i].type == star) {
        //   this.type = negative_matter;
        //   this.typeFixed = true;
        //   this.id += ' + ' + entities[i].id;
        // }

        //console.log("collide: " + this.id + " absorbs " + entities[i].id);

        GravitySimulation.entities.remove(object.id);
        break;

      case 'distributive':
        if (!this.attributes.fixed) {
          // && this.type != negative_matter) {

          /**
           * Elastic head-on collision
           * <http://hyperphysics.phy-astr.gsu.edu/hbase/colsta.html#c5>
           */

          object.velocity = Vector2.subtract(
            Vector2.scale(
              this.velocity,
              (2 * this.mass) / (this.mass + object.mass),
            ),
            Vector2.scale(
              object.velocity,
              (this.mass - object.mass) / (this.mass + object.mass),
            ),
          );

          this.velocity = Vector2.subtract(
            Vector2.scale(
              this.velocity,
              (this.mass - object.mass) / (this.mass + object.mass),
            ),
            Vector2.scale(
              object.velocity,
              (2 * this.mass) / (this.mass + object.mass),
            ),
          );
        }

        break;
    }

    GravitySimulation.effects.add(
      new Shockwave(
        20,
        new Vector2(object.position.x, object.position.y),
        new Vector2(this.velocity.x, this.velocity.y),
        object.radius * 5,
      ),
    );
  }

  private gravitate(object: GravityObject): void {
    const acceleration = Calculations.calculateAcceleration(
      Vector2.subtract(this.position, object.position),
      object.mass,
    );
    this.velocity.add(acceleration);
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
