import * as Utils from './utils.js';
import { c } from './index.js';
import { Game } from './game.js';

export class Vector2 {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
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

export interface EntityArgs {
    id?: number;
    pos: Vector2;
    vel?: Vector2;
}

export abstract class Entity {
    private readonly id: number;
    private pos: Vector2;
    private vel: Vector2;

    constructor(args: EntityArgs) {
        this.id = args.id || Game.getTick();
        this.pos = args.pos || Vector2.zero();
        this.vel = args.vel || Vector2.zero();
    }

    public abstract update(entities: Entity[]): void;

    protected abstract render(): void;

    public getId() {
        return this.id;
    }

    public getPos() {
        return this.pos;
    }
    public setPos(pos: Vector2) {
        this.pos = pos;
    }

    public getVel() {
        return this.vel;
    }
    public setVel(vel: Vector2) {
        this.vel = vel;
    }
}

export type GravityObjectArgs = EntityArgs & {
    mass: number;
}

export class GravityObject extends Entity {
    private mass: number;
    //private attributes: EntityAttributes;

    private radius: number;

    constructor(args: GravityObjectArgs) {
        super(args);
        this.mass = args.mass;
        //this.attributes = attributes;
    }

    public update(entities: Entity[]): void {
        //if (!this.attributes.fixed) {
			this.setPos(this.getPos().add(this.getVel()));
		//}
        this.gravitate(entities);
        this.updateRadiusByMass();

        this.render();
    }

    protected render(): void {
        c.beginPath();
        c.arc(this.getPos().x, this.getPos().y, this.radius, 0, 2 * Math.PI);
        c.fill();
        c.closePath();
    }

    private updateRadiusByMass(): void {
		if (this.mass < 1) {
            // delete
			//entities.splice(searchForEntity(this.id), 1); //perhaps implement queue to lessen calls
		} else {
            this.radius = Math.pow(3 * this.mass / (Math.PI * 4), 1/3);
		}
	}

    public gravitate(entities: Entity[]): void {
        entities.forEach((entity) => {
            if (!(entity instanceof GravityObject) || this.getId() == entity.getId()) {
                return;
            }

            let a = Utils.Calculations.calculateAcceleration(this.getPos().subtract(entity.getPos()), (entity as GravityObject).getMass());
            this.setVel(this.getVel().add(a));
        })
    }


    public getMass() {
        return this.mass;
    }
    public setMass(mass: number) {
        this.mass = mass;
    }
}