// import { Calculations } from '../utils/calculations';
// import type { OrbitParams } from '../utils/orbit-params';
// import type { GravityObject } from './gravity-object';

// export class System {
//   name: string;
//   center: string;
//   AU: number;
//   systemObjects: GravityObject[] = [];

//   constructor(systemJson) {
//     this.name = systemJson.name || 'Untitled System';
//     this.center = systemJson.center || null;
//     this.AU = systemJson.AU || 1;
//   }

//   public add(systemObject: GravityObject): void {
//     this.systemObjects.push(systemObject);
//   }

//   public calculateOrbits(): void {
//     this.systemObjects.forEach((obj) => {
//       if (!obj.attributes.orbit) {
//         return;
//       }
//       let orbitParams: OrbitParams;
//       // TODO: is there a better way to destructure?

//       if (obj.attributes.center === undefined) {
//         obj.attributes.center = this.center;
//       }

//       try {
//         orbitParams = Calculations.calculateOrbitPosition(
//           this,
//           obj.attributes.center,
//           obj,
//         );
//       } catch (error) {
//         console.error(error);
//       }

//       obj.pos = orbitParams.pos;
//       obj.vel = orbitParams.vel;
//     });
//   }
// }
