
import { Vector2, Entity } from './models.js';

const NON_ZERO_FACTOR = 0.00001;
const G = 0.1;

export class Calculations {
    public static calculateAcceleration(displacement: Vector2, mass: number): Vector2 {
        let direction: Vector2 = displacement.normalized();
        if (displacement.equals(Vector2.zero())) {
            displacement.add(new Vector2(NON_ZERO_FACTOR, NON_ZERO_FACTOR));
        }
        
        let aMagnitude: number = -G * mass / (displacement.magnitude() * displacement.magnitude());
    
        return direction.scale(aMagnitude);
    }
}

interface System {
    systemName: string;
    systemCenter: string;
    AU: number;
    systemObjects: SystemObject[]; 
}

interface SystemObject {
    name: string;
    mass: number;
    pos?: Vector2;
    distance?: Vector2;
    entityAttributes: EntityAttributes[];
}

interface EntityAttributes {
    fixed?: boolean;
    orbit?: boolean;
    primaryColor: string;
}

export class SystemBuilder {
    public static createSystem(systemName: string): Entity[] {
        let system: Entity[] = [];

        // let test: System = JSON.parse(systems.systems.toString())
        // console.log(test);

        return system;
    }
}