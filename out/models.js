import * as Utils from './utils.js';
import { c } from './index.js';
export class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    static add(v1, v2) {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    static subtract(v1, v2) {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    static scale(v, scalar) {
        return new Vector2(v.x * scalar, v.y * scalar);
    }
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
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
    copy() {
        return new Vector2(this.x, this.y);
    }
}
export class Entity {
    constructor(args) {
        this._id = args.id || Math.random();
        this._name = args.name || "Untitled Entity";
        this._pos = args.pos || Vector2.zero();
        this._vel = args.vel || Vector2.zero();
    }
    update(entities, controller) { }
    render(controller) { }
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
        this.systemObjects = [];
        this.name = systemJson.name || "Untitled System";
        this.center = systemJson.center || null;
        this.AU = systemJson.AU || 1;
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
            obj.pos = orbitParams.pos;
            obj.vel = orbitParams.vel;
        });
    }
}
export class EntityAttributes {
    constructor(attributesJson) {
        this.fixed = attributesJson.fixed || false;
        this.orbit = attributesJson.orbit || false;
        this.center = attributesJson.center || undefined;
        this.distance = attributesJson.distance || 0;
        this.primaryColor = attributesJson.primaryColor || "#fff";
    }
}
export class GravityObject extends Entity {
    constructor(args) {
        super(args);
        this._lastPos = [];
        this._maxPosEntries = 20;
        this.MIN_DOT_SIZE = 2;
        this.MIN_TAG_OFFSET = this.MIN_DOT_SIZE * 3;
        // Threshold for when a new pos should be added
        this.DIAMOND_ANGLE_THRESHOLD = Utils.Calculations.radiansToDiamondAngle(Utils.Calculations.degreesToRadians(10));
        this._mass = args.mass;
        this.attributes = args.attributes;
    }
    update(entities, controller) {
        //if (!this.attributes.fixed) {
        this.pos.add(this.vel);
        //}
        this.gravitate(entities);
        this.updateRadiusByMass();
        this.updatePosEntries(controller.getActiveCamera().scale);
    }
    render(controller) {
        const camera = controller.getActiveCamera();
        const scale = camera.scale;
        const renderPos = Utils.Calculations.calculateRenderPos(this.pos, camera);
        // Cull: do not render if out of canvas bounds
        if (Utils.Canvas.outOfBounds(renderPos)) {
            return;
        }
        const drawBody = () => {
            c.beginPath();
            c.fillStyle = this.attributes.primaryColor;
            if (this._radius * scale < this.MIN_DOT_SIZE) {
                c.arc(renderPos.x, renderPos.y, this.MIN_DOT_SIZE, 0, 2 * Math.PI);
            }
            else {
                c.arc(renderPos.x, renderPos.y, this._radius * scale, 0, 2 * Math.PI);
            }
            c.fill();
            c.closePath();
        };
        const drawText = () => {
            let tagOffset = new Vector2(this._radius * scale, this._radius * scale * 2);
            if (tagOffset.x < this.MIN_TAG_OFFSET) {
                tagOffset = new Vector2(this.MIN_TAG_OFFSET, this.MIN_TAG_OFFSET * 2);
            }
            const indent = new Vector2(5, 10); // TODO: check if it is more performant to have unchanging function constants inside or outside loop
            c.beginPath();
            c.strokeStyle = "#000"; // Colors.Black;
            c.fillStyle = this.attributes.primaryColor; // Text color
            c.lineWidth = 3;
            c.strokeText(this.name, renderPos.x + tagOffset.x, renderPos.y + tagOffset.y);
            c.lineWidth = 1;
            c.fillText(this.name, renderPos.x + tagOffset.x, renderPos.y + tagOffset.y);
            c.fillText("<TYPE>" + " / " + Math.round(this.mass), indent.x + renderPos.x + tagOffset.x, renderPos.y + tagOffset.y + indent.y);
            c.fillText("(" + Math.round(this.pos.x) + ", " + Math.round(this.pos.y) + ")", indent.x + renderPos.x + tagOffset.x, renderPos.y + tagOffset.y + indent.y * 2);
            c.closePath();
        };
        const drawTrail = () => {
            const trailNodeRadius = 2;
            let trailRenderPos;
            c.beginPath();
            c.strokeStyle = this.attributes.primaryColor; // TODO: consider using gradients to ease transition
            c.fillStyle = this.attributes.primaryColor;
            c.lineWidth = 1;
            this._lastPos.forEach(pos => {
                trailRenderPos = Utils.Calculations.calculateRenderPos(pos, camera);
                c.lineTo(trailRenderPos.x, trailRenderPos.y);
                c.fillRect(trailRenderPos.x - trailNodeRadius * 0.5, trailRenderPos.y - trailNodeRadius * 0.5, trailNodeRadius, trailNodeRadius);
            });
            c.lineTo(renderPos.x, renderPos.y);
            c.stroke();
            c.closePath();
        };
        const draw = () => {
            drawTrail();
            drawBody();
            drawText();
        };
        draw();
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
            const a = Utils.Calculations.calculateAcceleration(Vector2.subtract(this.pos, entity.pos), entity.mass);
            this.vel.add(a);
        });
    }
    updatePosEntries(scale) {
        const newPosEntry = (pos) => {
            if (this._lastPos.length > this._maxPosEntries - 1) {
                this._lastPos.splice(0, 1);
            }
            this._lastPos.push(pos.copy()); // Need to copy as simply pushing would pass by reference, resulting in the value changing
        };
        const passPosThreshold = () => {
            const scaledThreshold = 50 / scale;
            const lastPos1 = this._lastPos[this._lastPos.length - 1]; // TODO: is there a better way of getting last element without removing (e.g: pop())
            const lastPos2 = this._lastPos[this._lastPos.length - 2];
            // Calculate displacement for old: (last - 2ndLast), and new: (now - last)
            let oldDisplacement = Vector2.subtract(lastPos2, lastPos1);
            let newDisplacement = Vector2.subtract(lastPos1, this.pos);
            // Calculate the diamond angle between the two displacement vectors
            let displacementAngle = Math.abs(Utils.Calculations.toDiamondAngle(newDisplacement) - Utils.Calculations.toDiamondAngle(oldDisplacement));
            if (newDisplacement.magnitude() > scaledThreshold || displacementAngle > this.DIAMOND_ANGLE_THRESHOLD) {
                return true;
            }
            return false;
        };
        if (this._lastPos.length < 2) {
            newPosEntry(this.pos);
            return;
        }
        // Second if to check, as passPosThreshold requires at least one existing entry
        if (passPosThreshold()) {
            newPosEntry(this.pos);
        }
    }
    get mass() {
        return this._mass;
    }
    set mass(mass) {
        this._mass = mass;
    }
}
//# sourceMappingURL=models.js.map