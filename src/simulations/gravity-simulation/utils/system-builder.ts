// import type { EntityAttributes } from '../models/entity';
// import {
//   GravityObject,
//   type GravityObjectArgs,
// } from '../models/gravity-object';
// import { System } from '../models/system';

// export class SystemBuilder {
//   private static deserializer(json: string, systemName: string): System {
//     const parsedSystems: System[] = [];

//     const systemsJsonObj: System[] = JSON.parse(json).systems;

//     const systemJsonObj: System = systemsJsonObj.find(
//       (system) => system.name == systemName,
//     );
//     const parsedSystem: System = new System(systemJsonObj);

//     systemJsonObj.systemObjects.forEach((objJson) => {
//       const attributes: EntityAttributes = new EntityAttributes(
//         objJson.attributes,
//       );
//       attributes.distance *= parsedSystem.AU; // Convert distance to system AU

//       const args: GravityObjectArgs = {
//         name: objJson.name,
//         mass: objJson.mass,
//         attributes: attributes,
//       };

//       console.log(attributes);

//       parsedSystem.add(new GravityObject(args));
//     });

//     parsedSystem.calculateOrbits();

//     return parsedSystem;
//   }

//   public static createSystem(name: string): System {
//     const system: System = SystemBuilder.deserializer(systemsJson, name);

//     return system;
//   }
// }
