import { G, NON_ZERO_FACTOR } from '../constants';
import type GravityObject from '../models/entity/gravity-object';
import type System from '../models/system/system';
import Vector2 from '../models/vector2';
import type { OrbitParams } from './orbit-params';

export default class Calculations {
  public static calculateAcceleration(
    displacement: Vector2,
    mass: number,
  ): Vector2 {
    const direction: Vector2 = displacement.normalized();
    if (displacement.equals(Vector2.zero())) {
      displacement.add(new Vector2(NON_ZERO_FACTOR, NON_ZERO_FACTOR));
    }

    const aMagnitude: number =
      (-G * mass) / (displacement.magnitude() * displacement.magnitude());

    return Vector2.scale(direction, aMagnitude);
  }

  public static calculateOrbitPosition(
    system: System,
    parentName: string,
    satellite: GravityObject,
  ): OrbitParams {
    const isClockwise: boolean = false;
    const angle: number = Math.random() * 2 * Math.PI;

    const position: Vector2 = new Vector2();
    const velocity: Vector2 = new Vector2();

    const parent: GravityObject | undefined = system.systemObjects.find(
      (obj) => obj.name == parentName,
    );

    if (!parent) {
      throw new Error('Could not find parent object with name: ' + parentName);
    }

    if (!satellite.attributes.distance) {
      throw new Error(
        'Distance was not provided for satellite: ' + satellite.name,
      );
    }

    position.x = Math.round(
      satellite.attributes.distance * Math.cos(angle) + parent.position.x,
    );
    position.y = Math.round(
      satellite.attributes.distance * Math.sin(angle) + parent.position.y,
    );

    const separation: number = Vector2.subtract(
      parent.position,
      position,
    ).magnitude();
    const vScalar = Math.sqrt((G * parent.mass) / separation);

    if (isClockwise) {
      // Use 0 - - - 0 + + + graphing method to determine signs

      velocity.x = vScalar * -Math.sin(angle);
      velocity.y = vScalar * Math.cos(angle);
    } else {
      velocity.x = vScalar * Math.sin(angle);
      velocity.y = vScalar * -Math.cos(angle);
    }

    velocity.add(parent.velocity);

    return { position, velocity };
  }

  public static degreesToRadians(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // https://stackoverflow.com/questions/1427422/cheap-algorithm-to-find-measure-of-angle-between-vectors
  public static toDiamondAngle(v: Vector2): number {
    if (v.y >= 0) return v.x >= 0 ? v.y / (v.x + v.y) : 1 - v.x / (-v.x + v.y);
    else return v.x < 0 ? 2 - v.y / (-v.x - v.y) : 3 + v.x / (v.x - v.y);
  }

  public static diamondAngleToPoint(dia: number) {
    return {
      x: dia < 2 ? 1 - dia : dia - 3,
      y: dia < 3 ? (dia > 1 ? 2 - dia : dia) : dia - 4,
    };
  }

  /**
   * Do not use in loops as calculations require cos and sin
   * @param rad Angle in radians
   * @returns Angle in diamond angle units
   */
  public static radiansToDiamondAngle(rad: number): number {
    return Calculations.toDiamondAngle(
      new Vector2(Math.cos(rad), Math.sin(rad)),
    );
  }
}
