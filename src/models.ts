import * as Utils from './utils.js';
import { c } from './index.js';
import { Game } from './game.js';
import { PlayerController } from './input.js';

export class Vector2 {
    public x: number;
    public y: number;

    constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    public static add(v1: Vector2, v2: Vector2) {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    public add(v: Vector2) {
        this.x += v.x;
        this.y += v.y;
    }

    public static subtract(v1: Vector2, v2: Vector2) {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    public subtract(v: Vector2) {
        this.x -= v.x;
        this.y -= v.y;
    }

    public static scale(v: Vector2, scalar: number): Vector2 {
        return new Vector2(v.x * scalar, v.y * scalar);
    }

    public scale(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }

    public equals(v: Vector2): boolean {
        return this.x == v.x && this.y == v.y;
    }

    public dot(v: Vector2): number {
        return this.x*v.x + this.y*v.y;
    }

    public magnitude(): number {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    public normalized(): Vector2 {
        return new Vector2(this.x/this.magnitude(), this.y/this.magnitude());
    }

    public static zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}


export class EntityAttributes {
    fixed?: boolean = false;
    orbit?: boolean = false;
    center?: string = undefined;
    distance?: number = 0;
    primaryColor: string = "#000";
}




export interface EntityArgs {
    id?: number;
    name?: string;
    pos?: Vector2;
    vel?: Vector2;
}

export abstract class Entity {
    private readonly _id: number;
    private readonly _name: string;
    private _pos: Vector2;
    private _vel: Vector2;

    constructor(args: EntityArgs) {
        this._id = args.id || Math.random();
        this._name = args.name || "Untitled Entity"
        this._pos = args.pos || Vector2.zero();
        this._vel = args.vel || Vector2.zero();
    }

    public update(entities: Entity[], controller: PlayerController): void {}

    public render(controller: PlayerController): void {};

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get pos() {
        return this._pos;
    }
    set pos(pos: Vector2) {
        this._pos = pos;
    }

    get vel() {
        return this._vel;
    }
    set vel(vel: Vector2) {
        this._vel = vel;
    }
}



export class System {
    name: string;
    center: string;
    AU: number;
    systemObjects: GravityObject[] = [];

    constructor(systemJson) {
        this.name = systemJson.name || "Untitled System";
        this.center = systemJson.center || null;
        this.AU = systemJson.AU || 1;
    }

    public add(systemObject: GravityObject): void {
        this.systemObjects.push(systemObject);
    }

    public calculateOrbits(): void {
        this.systemObjects.forEach(obj => {
            if (!obj.attributes.orbit) {
                return;
            }
            let orbitParams: Utils.OrbitParams
            // TODO: is there a better way to destructure?

            if (obj.attributes.center === undefined) {
                obj.attributes.center = this.center;
            }

            try {
                orbitParams = Utils.Calculations.calculateOrbitPosition(this, obj.attributes.center, obj);
            } catch (error) {
                console.error(error);
            }

            obj.pos = orbitParams.pos;
            obj.vel = orbitParams.vel;
        });
    }
}

export type GravityObjectArgs = EntityArgs & {
    mass: number;
    attributes: EntityAttributes;
}


export class GravityObject extends Entity {
    private _mass: number;
    public attributes: EntityAttributes;

    private _radius: number;

    private _lastPos: Vector2[];
    private _maxPosEntries: number = 20;

    private readonly MIN_DOT_SIZE: number = 2;
    private readonly MIN_TAG_OFFSET = this.MIN_DOT_SIZE * 3;

    // Threshold for when a new pos should be added
    private readonly DIAMOND_ANGLE_THRESHOLD: number = Utils.Calculations.radiansToDiamondAngle(
        Utils.Calculations.degreesToRadians(10))

    constructor(args: GravityObjectArgs) {
        super(args);
        this._mass = args.mass;
        this.attributes = args.attributes;
        this._lastPos = []
    }

    public update(entities: Entity[], controller: PlayerController): void {
        //if (!this.attributes.fixed) {
			this.pos.add(this.vel);
		//}
        this.gravitate(entities);
        this.updateRadiusByMass();

        this.updatePosEntries(controller.getActiveCamera().scale);
    }

    public render(controller: PlayerController): void {
        const camera = controller.getActiveCamera();
        const scale = camera.scale;

        const renderPos: Vector2 = Utils.Calculations.calculateRenderPos(this.pos, camera);

        const drawBody = () => {
            c.beginPath();
            c.fillStyle = this.attributes.primaryColor;

            if (this._radius * scale < this.MIN_DOT_SIZE) {
                c.arc(renderPos.x, renderPos.y, this.MIN_DOT_SIZE, 0, 2 * Math.PI);
            } else {
                c.arc(renderPos.x, renderPos.y, this._radius * scale, 0, 2 * Math.PI);
            }
            
            c.fill();
            c.closePath();
        }

        const drawText = () => {
            let tagOffset: Vector2 = new Vector2(this._radius * scale, this._radius * scale * 2);
            
            if (tagOffset.x < this.MIN_TAG_OFFSET) {
                tagOffset = new Vector2(this.MIN_TAG_OFFSET, this.MIN_TAG_OFFSET * 2);
            }

            const indent: Vector2 = new Vector2(5, 10); // TODO: check if it is more performant to have unchanging function constants inside or outside loop

            c.beginPath();

            c.strokeStyle = "#000" // Colors.Black;
            c.fillStyle = this.attributes.primaryColor; // Text color
            c.lineWidth = 3;
            c.strokeText(this.name, renderPos.x + tagOffset.x, renderPos.y + tagOffset.y);
            c.lineWidth = 1;
            c.fillText(this.name, renderPos.x + tagOffset.x, renderPos.y + tagOffset.y);
        
            c.fillText("<TYPE>" + " / " + Math.round(this.mass), 
                indent.x + renderPos.x + tagOffset.x, renderPos.y + tagOffset.y + indent.y);
            c.fillText("(" + Math.round(this.pos.x) + ", " + Math.round(this.pos.y) + ")", 
                indent.x + renderPos.x + tagOffset.x, renderPos.y + tagOffset.y + indent.y * 2);
            
            c.closePath();
        }

        const drawTrail = () => {
            const trailNodeRadius = 2;
            let trailRenderPos: Vector2;

            c.beginPath();
            c.strokeStyle = this.attributes.primaryColor;
            c.fillStyle = this.attributes.primaryColor;
		    c.lineWidth = 1;

            this._lastPos.forEach(pos => {
                trailRenderPos = Utils.Calculations.calculateRenderPos(pos, camera);
                c.lineTo(trailRenderPos.x, trailRenderPos.y);
                c.fillRect(trailRenderPos.x - trailNodeRadius * 0.5, trailRenderPos.y - trailNodeRadius * 0.5, 
                    trailNodeRadius, trailNodeRadius)
            })
            c.lineTo(renderPos.x, renderPos.y);
            c.stroke();
            c.closePath();
        }

        const draw = () => {
            drawTrail();
            drawBody();
            drawText();
        }

        draw();
        
    }

    private updateRadiusByMass(): void {
		if (this.mass < 1) {
            // delete
			//entities.splice(searchForEntity(this.id), 1); //perhaps implement queue to lessen calls
		} else {
            this._radius = Math.pow(3 * this.mass / (Math.PI * 4), 1/3) * 0.1;
		}
	}

    private gravitate(entities: Entity[]): void {
        entities.forEach((entity) => {
            if (!(entity instanceof GravityObject) || this.id == entity.id) {
                return;
            }

            const a = Utils.Calculations.calculateAcceleration(Vector2.subtract(this.pos,entity.pos), (entity as GravityObject).mass);
            this.vel.add(a);
        })
    }

    private updatePosEntries(scale: number): void {
        const newPosEntry = (pos: Vector2): void => {
            if (this._lastPos.length > this._maxPosEntries - 1) {
                this._lastPos.splice(0, 1);
            }
            this._lastPos.push(pos.copy()); // Need to copy as simply pushing would pass by reference, resulting in the value changing
        }

        const passPosThreshold = (): boolean => {
            const scaledThreshold: number = 50/scale;
            const lastPos1: Vector2 = this._lastPos[this._lastPos.length - 1]; // TODO: is there a better way of getting last element without removing (e.g: pop())
            const lastPos2: Vector2 = this._lastPos[this._lastPos.length - 2];

            // Calculate displacement for old: (last - 2ndLast), and new: (now - last)
            let oldDisplacement: Vector2 = Vector2.subtract(lastPos2, lastPos1);
            let newDisplacement: Vector2 = Vector2.subtract(lastPos1, this.pos);

            // Calculate the diamond angle between the two displacement vectors
            let displacementAngle: number = Math.abs(
                Utils.Calculations.toDiamondAngle(newDisplacement) - Utils.Calculations.toDiamondAngle(oldDisplacement));

            if (newDisplacement.magnitude() > scaledThreshold || displacementAngle > this.DIAMOND_ANGLE_THRESHOLD) {
                return true;
            }
            return false;
        }

        if (this._lastPos.length < 2) {
            newPosEntry(this.pos);
            return;
        }
        
        // Second if to check, as passPosThreshold requires at least one existing entry
        if (passPosThreshold()) {
            newPosEntry(this.pos);
        }
    }

    public get mass() {
        return this._mass;
    }
    public set mass(mass: number) {
        this._mass = mass;
    }
}