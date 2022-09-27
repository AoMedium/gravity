//import systemJson from './json/systems.json';
import { Vector2, System, GravityObject, EntityAttributes, } from './models.js';
const NON_ZERO_FACTOR = 0.00001;
const G = 0.0001;
export class Calculations {
    static calculateRenderPos(pos, camera) {
        let renderPos = Vector2.scale(Vector2.subtract(pos, camera.pos), camera.scale);
        renderPos.add(new Vector2(innerWidth / 2, innerHeight / 2));
        return renderPos;
    }
    static calculateAcceleration(displacement, mass) {
        let direction = displacement.normalized();
        if (displacement.equals(Vector2.zero())) {
            displacement.add(new Vector2(NON_ZERO_FACTOR, NON_ZERO_FACTOR));
        }
        let aMagnitude = -G * mass / (displacement.magnitude() * displacement.magnitude());
        return Vector2.scale(direction, aMagnitude);
    }
    static calculateOrbitPosition(system, parentName, satellite) {
        console.log("Sat");
        console.log(satellite);
        const isClockwise = false;
        const angle = Math.random() * 2 * Math.PI;
        let pos = new Vector2();
        let vel = new Vector2();
        let parent = system.systemObjects.find(obj => obj.name == parentName);
        pos.x = Math.round(satellite.attributes.distance * Math.cos(angle) + parent.pos.x);
        pos.y = Math.round(satellite.attributes.distance * Math.sin(angle) + parent.pos.y);
        let separation = Vector2.subtract(parent.pos, pos).magnitude();
        let vScalar = Math.sqrt(G * parent.mass / separation);
        if (isClockwise) {
            // Use 0 - - - 0 + + + graphing method to determine signs
            vel.x = vScalar * -Math.sin(angle);
            vel.y = vScalar * Math.cos(angle);
        }
        else {
            vel.x = vScalar * Math.sin(angle);
            vel.y = vScalar * -Math.cos(angle);
        }
        return { pos, vel };
    }
}
export class SystemBuilder {
    static deserializer(json, systemName) {
        let parsedSystems = [];
        let systemsJsonObj = JSON.parse(json).systems;
        console.log(systemsJsonObj);
        let systemJsonObj = systemsJsonObj.find(system => system.name == systemName);
        let parsedSystem = new System(systemJsonObj);
        systemJsonObj.systemObjects.forEach(objJson => {
            console.log(objJson);
            let attributes;
            if (objJson.attributes == undefined) {
                attributes = new EntityAttributes();
            }
            else {
                attributes = objJson.attributes;
                attributes.distance *= parsedSystem.AU; // Convert distance to system AU
            }
            let args = {
                name: objJson.name,
                mass: objJson.mass,
                attributes: attributes
            };
            parsedSystem.add(new GravityObject(args));
        });
        parsedSystem.calculateOrbits();
        console.log(parsedSystem);
        return parsedSystem;
    }
    static createSystem(name) {
        let system = SystemBuilder.deserializer(systemsJson, name);
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
`;
//# sourceMappingURL=utils.js.map