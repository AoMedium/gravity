//import systemJson from './json/systems.json';
import { 
    Vector2, 
    System,
    Entity, 
    GravityObject, 
    GravityObjectArgs,
    EntityAttributes,
} from './models.js';
import { Camera } from './input.js';
import { Game } from './game.js';

const NON_ZERO_FACTOR = 0.00001;
const G = 0.0001;

export type OrbitParams = {
    pos: Vector2,
    vel: Vector2
}

export class Calculations {

    public static calculateRenderPos(pos: Vector2, camera: Camera): Vector2 {
        let renderPos = Vector2.scale(Vector2.subtract(pos, camera.pos), camera.scale)
        renderPos.add(new Vector2(innerWidth/2, innerHeight/2));

        return renderPos;
    }

    public static calculateAcceleration(displacement: Vector2, mass: number): Vector2 {
        let direction: Vector2 = displacement.normalized();
        if (displacement.equals(Vector2.zero())) {
            displacement.add(new Vector2(NON_ZERO_FACTOR, NON_ZERO_FACTOR));
        }
        
        let aMagnitude: number = -G * mass / (displacement.magnitude() * displacement.magnitude());
    
        return Vector2.scale(direction, aMagnitude);
    }

    public static calculateOrbitPosition(system: System, parentName: string, satellite: GravityObject): OrbitParams {
        const isClockwise: boolean = false;
        const angle: number = Math.random() * 2 * Math.PI;

        let pos: Vector2 = new Vector2();
        let vel: Vector2 = new Vector2();

        let parent: GravityObject = system.systemObjects.find(obj => obj.name == parentName);

        pos.x = Math.round(satellite.attributes.distance * Math.cos(angle) + parent.pos.x);
        pos.y = Math.round(satellite.attributes.distance * Math.sin(angle) + parent.pos.y);


        let separation: number = Vector2.subtract(parent.pos, pos).magnitude();
        let vScalar = Math.sqrt(G * parent.mass / separation);

        if (isClockwise) {
            // Use 0 - - - 0 + + + graphing method to determine signs

            vel.x = vScalar * -Math.sin(angle); 
            vel.y = vScalar * Math.cos(angle);
        } else {
            vel.x = vScalar * Math.sin(angle);
            vel.y = vScalar * -Math.cos(angle);
        }

        return { pos, vel };
    }

    public static degreesToRadians(deg: number): number {
        return deg * (Math.PI / 180);
    }

    // https://stackoverflow.com/questions/1427422/cheap-algorithm-to-find-measure-of-angle-between-vectors
    public static toDiamondAngle(v: Vector2): number {
        if (v.y >= 0)
            return (v.x >= 0 ? v.y/(v.x+v.y) : 1-v.x/(-v.x+v.y)); 
        else
            return (v.x < 0 ? 2-v.y/(-v.x-v.y) : 3+v.x/(v.x-v.y)); 
    }

    public static diamondAngleToPoint(dia: number) {
        return {
            "x": (dia < 2 ? 1-dia : dia-3), 
            "y": (dia < 3 ? ((dia > 1) ? 2-dia : dia) : dia-4)
        };
    }

    /**
     * Do not use in loops as calculations require cos and sin
     * @param rad Angle in radians
     * @returns Angle in diamond angle units
     */
    public static radiansToDiamondAngle(rad: number): number {
      return Calculations.toDiamondAngle(new Vector2(Math.cos(rad), Math.sin(rad)));
    }  
}

export class SystemBuilder {

    private static deserializer(json: string, systemName: string): System {
        let parsedSystems: System[] = [];
        
        let systemsJsonObj: System[] = JSON.parse(json).systems;

        let systemJsonObj: System = systemsJsonObj.find(system => system.name == systemName)
        let parsedSystem: System = new System(systemJsonObj);

        systemJsonObj.systemObjects.forEach(objJson => {

            let attributes: EntityAttributes;

            if (objJson.attributes == undefined) {
                attributes = new EntityAttributes();
            } else {
                attributes = objJson.attributes;
                attributes.distance *= parsedSystem.AU; // Convert distance to system AU
            }

            let args: GravityObjectArgs = {
                name: objJson.name,
                mass: objJson.mass,
                attributes: attributes
            };
            
            parsedSystem.add(new GravityObject(args));
        });

        parsedSystem.calculateOrbits();

        return parsedSystem;
    }

    public static createSystem(name: string): System {
        let system: System = SystemBuilder.deserializer(systemsJson, name);
        

        return system;
    }
}


let systemsJson = `{
    "systems": [
        {
            "name": "Basic System",
            "center": "Star",
            "AU": 5000, 

            "systemObjects": [
                {
                    "name": "Star",
                    "mass": 100000,
                    "pos": {
                        "x":0,
                        "y":0
                    }
                },
                {
                    "name": "Planet 1",
                    "mass": 100,
                    "pos": {
                        "x":0,
                        "y":0
                    },
                    "vel": {
                        "dx":0,
                        "dy":0
                    }
                }
            ]
        },
        {
            "name": "Sol Alpha",
            "center": "Sol Alpha",
            "AU": 5000,
        
            "systemObjects": [
                {
                    "name": "Sol Alpha",
                    "mass": 59600000,
                    "pos": { 
                        "x":0, 
                        "y":0
                    },
                    "attributes": { 
                            "fixed": true,
                            "primaryColor": "#fff" 
                        }
                },
                {
                    "name": "Kas",
                    "mass": 55,
                    "attributes": {
                            "orbit": true,
                            "distance": 0.387,
                            "primaryColor": "#aaa" 
                        }
                },
                {
                    "name": "Ayca",
                    "mass": 815,
                    "attributes": {
                            "orbit": true,
                            "distance": 0.723,
                            "primaryColor": "#ff9d00" 
                        }
                },
                {
                    "name": "Terra",
                    "mass": 1000,
                    "attributes": {
                            "orbit": true,
                            "distance": 1,
                            "primaryColor": "#00aeff" 
                        }
                }
            ]
        }
    ] 
}
`
