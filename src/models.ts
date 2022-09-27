import * as Utils from './utils.js';
import { c } from './index.js';
import { Game } from './game.js';

export class Vector2 {
    public x: number;
    public y: number;

    constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    public add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    public subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    public scale(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
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

    protected render(): void {};

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

            console.log(orbitParams)

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

    constructor(args: GravityObjectArgs) {
        super(args);
        this._mass = args.mass;
        this.attributes = args.attributes;
    }

    public update(entities: Entity[]): void {
        //if (!this.attributes.fixed) {
			this.pos = this.pos.add(this.vel);
		//}
        this.gravitate(entities);
        this.updateRadiusByMass();

        this.render();
    }

    protected render(): void {
        const scale = 0.01;
        c.beginPath();
        c.arc(innerWidth/2 + this.pos.x * scale, innerHeight/2 + this.pos.y * scale, this._radius, 0, 2 * Math.PI);
        c.fill();
        c.closePath();
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

            let a = Utils.Calculations.calculateAcceleration(this.pos.subtract(entity.pos), (entity as GravityObject).mass);
            this.vel = this.vel.add(a);
        })
    }


    public get mass() {
        return this._mass;
    }
    public set mass(mass: number) {
        this._mass = mass;
    }
}