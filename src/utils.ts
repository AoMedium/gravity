//import systemJson from './json/systems.json';
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

        let parsedSystem: System = JSON.parse(json).systems;

        
        console.log(parsedSystem);

        return system;
    }
}


let json = `{
    "systems": [
        {
            "systemName": "Sol Alpha",
            "systemCenter": "Sol Alpha",
            "AU": 5000,
            "systemObjects": [
                {
                    "name": "Sol Alpha",
                    "mass": 59600000,
                    "entityAttributes": {
                        "fixed": true,
                        "primaryColor": "#fff"
                    }
                },
                {
                    "name": "Kas",
                    "mass": 55,
                    "distance": 0.387,
                    "entityAttributes": {
                        "orbit": true,
                        "primaryColor": "#aaa"
                    }
                },
                {
                    "name": "Ayca",
                    "mass": 815,
                    "distance": 0.723,
                    "entityAttributes": {
                        "orbit": true,
                        "primaryColor": "#ff9d00"
                    }
                },
                {
                    "name": "Terra",
                    "mass": 1000,
                    "distance": 1,
                    "entityAttributes": {
                        "orbit": true,
                        "primaryColor": "#00aeff"
                    }
                }
            ]
        }
    ]
}`
