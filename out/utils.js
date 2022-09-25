var NON_ZERO_FACTOR = 0.00001;
var G = 0.1;
var Utility = /** @class */ (function () {
    function Utility() {
    }
    Utility.calculateAcceleration = function (displacement, mass) {
        var direction = displacement.normalized();
        if (displacement.equals(Vector2.zero())) {
            displacement.add(new Vector2(NON_ZERO_FACTOR, NON_ZERO_FACTOR));
        }
        var aMagnitude = -G * mass / (displacement.magnitude() * displacement.magnitude());
        return direction.scale(aMagnitude);
    };
    return Utility;
}());
//# sourceMappingURL=utils.js.map