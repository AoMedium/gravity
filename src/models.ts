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

    public update(entities: Entity[]): void {}

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
    systemObjects: GravityObject[];

    constructor(systemJson) {
        this.name = systemJson.name || "Untitled System";
        this.center = systemJson.center || null;
        this.AU = systemJson.AU || 1;
        this.systemObjects = [];
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

    private readonly tagOffset: Vector2 = new Vector2(6, 10);

    constructor(args: GravityObjectArgs) {
        super(args);
        this._mass = args.mass;
        this.attributes = args.attributes;
    }

    public update(entities: Entity[]): void {
        //if (!this.attributes.fixed) {
			this.pos.add(this.vel);
		//}
        this.gravitate(entities);
        this.updateRadiusByMass();
    }

    public render(controller: PlayerController): void {
        let camera = controller.getActiveCamera();
        let scale = camera.scale;

        let renderPos: Vector2 = Utils.Calculations.calculateRenderPos(this.pos, camera);

        let drawBody = () => {
            c.fillStyle = this.attributes.primaryColor;
            c.beginPath();
            c.arc(renderPos.x, renderPos.y, this._radius * scale, 0, 2 * Math.PI);
            c.fill();
            c.closePath();
        }

        let drawText = () => {

            c.strokeStyle = "#000" // Colors.Black;
            c.fillStyle = this.attributes.primaryColor; // Text color
            c.lineWidth = 3;
            c.strokeText(this.name, renderPos.x + this.tagOffset.x, renderPos.y + this.tagOffset.y);
            c.lineWidth = 1;
            c.fillText(this.name, renderPos.x + this.tagOffset.x, renderPos.y + this.tagOffset.y);
        
            c.fillText("<TYPE>" + " / " + Math.round(this.mass), 
                renderPos.x + this.tagOffset.x, renderPos.y + this.tagOffset.y * 2);
            
            c.closePath();
        }

        drawBody();
        drawText();
        
    }

    private updateRadiusByMass(): void {
		if (this.mass < 1) {
            // delete
			//entities.splice(searchForEntity(this.id), 1); //perhaps implement queue to lessen calls
		} else {
            this._radius = Math.pow(3 * this.mass / (Math.PI * 4), 1/3) * 0.1;
		}
	}

    public gravitate(entities: Entity[]): void {
        entities.forEach((entity) => {
            if (!(entity instanceof GravityObject) || this.id == entity.id) {
                return;
            }

            let a = Utils.Calculations.calculateAcceleration(Vector2.subtract(this.pos,entity.pos), (entity as GravityObject).mass);
            this.vel.add(a);
        })
    }


    public get mass() {
        return this._mass;
    }
    public set mass(mass: number) {
        this._mass = mass;
    }
}