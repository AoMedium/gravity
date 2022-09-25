const NON_ZERO_FACTOR = 0.00001;
const G = 0.1;

class Utility {
    public static calculateAcceleration(displacement: Vector2, mass: number): Vector2 {
        let direction: Vector2 = displacement.normalized();
        if (displacement.equals(Vector2.zero())) {
            displacement.add(new Vector2(NON_ZERO_FACTOR, NON_ZERO_FACTOR));
        }
        
        let aMagnitude: number = -G * mass / (displacement.magnitude() * displacement.magnitude());
    
        return direction.scale(aMagnitude);
    }
}