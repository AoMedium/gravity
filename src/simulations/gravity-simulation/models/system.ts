import Calculations from '../utils/calculations';
import type { OrbitParams } from '../models/orbit-params';
import type SystemDTO from '../models/dto/system-dto';
import type GravityObject from '../models/entity/gravity-object';

export default class System {
  name: string;
  center: string | undefined;
  AU: number;
  systemObjects: GravityObject[] = [];

  constructor(system: SystemDTO) {
    this.name = system.name || 'Untitled System';
    this.center = system.center;
    this.AU = system.AU || 1;
  }

  public add(systemObject: GravityObject): void {
    this.systemObjects.push(systemObject);
  }

  public calculateOrbits(): void {
    this.systemObjects.forEach((obj) => {
      if (!obj.attributes.orbit) {
        return;
      }
      let orbitParams: OrbitParams | undefined;
      // TODO: is there a better way to destructure?

      if (!obj.attributes.center) {
        obj.attributes.center = this.center;
      }

      try {
        orbitParams = Calculations.calculateOrbitPosition(
          this,
          obj.attributes.center!, // Will always be assigned
          obj,
        );
        obj.position = orbitParams.position;
        obj.velocity = orbitParams.velocity;
      } catch (error) {
        console.error(error);
      }
    });
  }
}
