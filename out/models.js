import * as Utils from './utils.js';
import { c } from './index.js';
export class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    scale(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    equals(v) {
        return this.x == v.x && this.y == v.y;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalized() {
        return new Vector2(this.x / this.magnitude(), this.y / this.magnitude());
    }
    static zero() {
        return new Vector2(0, 0);
    }
}
export class EntityAttributes {
    constructor() {
        this.fixed = false;
        this.orbit = false;
        this.center = undefined;
        this.distance = 0;
        this.primaryColor = "#000";
    }
}
export class Entity {
    constructor(args) {
        this._id = args.id || Math.random();
        this._name = args.name || "Untitled Entity";
        this._pos = args.pos || Vector2.zero();
        this._vel = args.vel || Vector2.zero();
    }
    update(entities) { }
    render() { }
    ;
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get pos() {
        return this._pos;
    }
    set pos(pos) {
        this._pos = pos;
    }
    get vel() {
        return this._vel;
    }
    set vel(vel) {
        this._vel = vel;
    }
}
export class System {
    constructor(systemJson) {
        this.name = systemJson.name || "Untitled System";
        this.center = systemJson.center || null;
        this.AU = systemJson.AU || 1;
        this.systemObjects = [];
    }
    add(systemObject) {
        this.systemObjects.push(systemObject);
    }
    calculateOrbits() {
        this.systemObjects.forEach(obj => {
            if (!obj.attributes.orbit) {
                return;
            }
            let orbitParams;
            // TODO: is there a better way to destructure?
            if (obj.attributes.center === undefined) {
                obj.attributes.center = this.center;
            }
            try {
                orbitParams = Utils.Calculations.calculateOrbitPosition(this, obj.attributes.center, obj);
            }
            catch (error) {
                console.error(error);
            }
            console.log(orbitParams);
            obj.pos = orbitParams.pos;
            obj.vel = orbitParams.vel;
        });
    }
}
export class GravityObject extends Entity {
    constructor(args) {
        super(args);
        this._mass = args.mass;
        this.attributes = args.attributes;
    }
    update(entities) {
        //if (!this.attributes.fixed) {
        this.pos = this.pos.add(this.vel);
        //}
        this.gravitate(entities);
        this.updateRadiusByMass();
        this.render();
    }
    render() {
        const scale = 0.01;
        c.beginPath();
        c.arc(innerWidth / 2 + this.pos.x * scale, innerHeight / 2 + this.pos.y * scale, this._radius, 0, 2 * Math.PI);
        c.fill();
        c.closePath();
    }
    updateRadiusByMass() {
        if (this.mass < 1) {
            // delete
            //entities.splice(searchForEntity(this.id), 1); //perhaps implement queue to lessen calls
        }
        else {
            this._radius = Math.pow(3 * this.mass / (Math.PI * 4), 1 / 3) * 0.1;
        }
    }
    gravitate(entities) {
        entities.forEach((entity) => {
            if (!(entity instanceof GravityObject) || this.id == entity.id) {
                return;
            }
            let a = Utils.Calculations.calculateAcceleration(this.pos.subtract(entity.pos), entity.mass);
            this.vel = this.vel.add(a);
        });
    }
    get mass() {
        return this._mass;
    }
    set mass(mass) {
        this._mass = mass;
    }
}
//# sourceMappingURL=models.js.map