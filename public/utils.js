import { Vector2 } from './models.js';
const NON_ZERO_FACTOR = 0.00001;
const G = 0.1;
export class Calculations {
    static calculateAcceleration(displacement, mass) {
        let direction = displacement.normalized();
        if (displacement.equals(Vector2.zero())) {
            displacement.add(new Vector2(NON_ZERO_FACTOR, NON_ZERO_FACTOR));
        }
        let aMagnitude = -G * mass / (displacement.magnitude() * displacement.magnitude());
        return direction.scale(aMagnitude);
    }
}
export class SystemBuilder {
    static createSystem(systemName) {
        let system = [];
        // let test: System = JSON.parse(systems.systems.toString())
        // console.log(test);
        return system;
    }
}
//# sourceMappingURL=utils.js.map