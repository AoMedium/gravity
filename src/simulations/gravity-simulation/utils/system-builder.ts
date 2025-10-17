import type SystemDTO from '../models/dto/system-dto';
import GravityObject from '../models/entity/gravity-object';
import System from '../models/system';

export default class SystemBuilder {
  private static deserializer(json: string, systemName: string): System {
    // const parsedSystems: System[] = [];

    const systemsDTO: SystemDTO[] = JSON.parse(json).systems;

    const systemDTO: SystemDTO | undefined = systemsDTO.find(
      (system) => system.name == systemName,
    );

    if (!systemDTO) {
      throw new Error('Could not find system: ' + systemName);
    }

    const parsedSystem = new System(systemDTO);

    systemDTO.systemObjects.forEach((gravityObjectDTO) => {
      const obj = new GravityObject(gravityObjectDTO);
      obj.attributes.distance *= parsedSystem.AU; // Convert distance to system AU

      parsedSystem.add(obj);
    });

    parsedSystem.calculateOrbits();

    return parsedSystem;
  }

  public static createSystem(json: string, name: string): System {
    const system: System = SystemBuilder.deserializer(json, name);

    return system;
  }
}
