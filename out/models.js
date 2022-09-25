var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.add = function (v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    };
    Vector2.prototype.subtract = function (v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    };
    Vector2.prototype.scale = function (scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    };
    Vector2.prototype.equals = function (v) {
        return this.x == v.x && this.y == v.y;
    };
    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector2.prototype.magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2.prototype.normalized = function () {
        return new Vector2(this.x / this.magnitude(), this.y / this.magnitude());
    };
    Vector2.zero = function () {
        return new Vector2(0, 0);
    };
    return Vector2;
}());
var Entity = /** @class */ (function () {
    function Entity(id, pos, vel) {
        this.id = id;
        this.pos = pos;
        this.vel = vel;
    }
    Entity.prototype.getId = function () {
        return this.id;
    };
    Entity.prototype.getPos = function () {
        return this.pos;
    };
    Entity.prototype.setPos = function (pos) {
        this.pos = pos;
    };
    Entity.prototype.getVel = function () {
        return this.vel;
    };
    Entity.prototype.setVel = function (vel) {
        this.vel = vel;
    };
    return Entity;
}());
var GravityObject = /** @class */ (function (_super) {
    __extends(GravityObject, _super);
    function GravityObject(id, mass, pos, vel, attributes) {
        if (attributes === void 0) { attributes = {
            fixed: false
        }; }
        var _this = _super.call(this, id, pos, vel) || this;
        _this.mass = mass;
        _this.attributes = attributes;
        return _this;
    }
    GravityObject.prototype.update = function (entities) {
        if (!this.attributes.fixed) {
            this.setPos(this.getPos().add(this.getVel()));
        }
        this.gravitate(entities);
        this.updateRadiusByMass();
        this.render();
    };
    GravityObject.prototype.render = function () {
        c.beginPath();
        c.arc(this.getPos().x, this.getPos().y, this.radius, 0, 2 * Math.PI);
        c.fill();
        c.closePath();
    };
    GravityObject.prototype.updateRadiusByMass = function () {
        if (this.mass < 1) {
            // delete
            //entities.splice(searchForEntity(this.id), 1); //perhaps implement queue to lessen calls
        }
        else {
            this.radius = Math.pow(3 * this.mass / (Math.PI * 4), 1 / 3);
        }
    };
    GravityObject.prototype.gravitate = function (entities) {
        var _this = this;
        entities.forEach(function (entity) {
            if (!(entity instanceof GravityObject) || _this.getId() == entity.getId()) {
                return;
            }
            var a = Utility.calculateAcceleration(_this.getPos().subtract(entity.getPos()), entity.getMass());
            _this.setVel(_this.getVel().add(a));
        });
    };
    GravityObject.prototype.getMass = function () {
        return this.mass;
    };
    GravityObject.prototype.setMass = function (mass) {
        this.mass = mass;
    };
    return GravityObject;
}(Entity));
//# sourceMappingURL=models.js.map