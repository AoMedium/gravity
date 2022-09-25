import * as Utils from './utils.js';
import { c } from './index.js';
export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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
export class Entity {
    constructor(id, pos, vel) {
        this.id = id;
        this.pos = pos;
        this.vel = vel;
    }
    getId() {
        return this.id;
    }
    getPos() {
        return this.pos;
    }
    setPos(pos) {
        this.pos = pos;
    }
    getVel() {
        return this.vel;
    }
    setVel(vel) {
        this.vel = vel;
    }
}
export class GravityObject extends Entity {
    constructor(id, mass, pos, vel) {
        super(id, pos, vel);
        this.mass = mass;
        //this.attributes = attributes;
    }
    update(entities) {
        //if (!this.attributes.fixed) {
        this.setPos(this.getPos().add(this.getVel()));
        //}
        this.gravitate(entities);
        this.updateRadiusByMass();
        this.render();
    }
    render() {
        c.beginPath();
        c.arc(this.getPos().x, this.getPos().y, this.radius, 0, 2 * Math.PI);
        c.fill();
        c.closePath();
    }
    updateRadiusByMass() {
        if (this.mass < 1) {
            // delete
            //entities.splice(searchForEntity(this.id), 1); //perhaps implement queue to lessen calls
        }
        else {
            this.radius = Math.pow(3 * this.mass / (Math.PI * 4), 1 / 3);
        }
    }
    gravitate(entities) {
        entities.forEach((entity) => {
            if (!(entity instanceof GravityObject) || this.getId() == entity.getId()) {
                return;
            }
            let a = Utils.Calculations.calculateAcceleration(this.getPos().subtract(entity.getPos()), entity.getMass());
            this.setVel(this.getVel().add(a));
        });
    }
    getMass() {
        return this.mass;
    }
    setMass(mass) {
        this.mass = mass;
    }
}
//# sourceMappingURL=models.js.map