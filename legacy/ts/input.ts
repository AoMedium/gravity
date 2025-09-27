import { Game } from "./game.js";
import { Vector2 } from "./models.js";

export class Camera {
    private _id: number;
    private _pos: Vector2;
    private _vel: Vector2 = Vector2.zero();
    private _scale: number = 1;

    private _useSmoothMovement: boolean = false;

    // Drag for smooth movement
    private readonly drag: number = 0.01;
    // Scaled amount to move when useSmoothMovement is disabled
    private readonly staticMoveFactor = 20;

    constructor(pos?: Vector2) {
        this._id = Math.random();
        this._pos = pos || Vector2.zero();
    }

    public update(): void {
        if (this._vel.equals(Vector2.zero())) {
            return;
        }

        if (this._useSmoothMovement) {
            // Limit how small the velocity can go, based on scale
            if (this._vel.magnitude() < this.drag / this._scale) {
                this._vel = Vector2.zero();
            } else {
                this._vel.scale(1 - this.drag);
            }

            this._pos.add(this._vel);
        } else {
            this._pos.add(Vector2.scale(this._vel, this.staticMoveFactor));
            this._vel = Vector2.zero();
        }
    }

    public toggleSmoothMovement(): void {
        this._useSmoothMovement = ! this._useSmoothMovement;
    }

    get id() {
        return this._id;
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
        this._pos = vel;
    } 

    get scale() {
        return this._scale;
    }
    set scale(scale: number) {
        if (scale <= 0) {
            console.error("Cannot have a scale less than 0")
            return;
        }
        this._scale = scale;
    }
}

export class PlayerController {
    private _cameras: Camera[] = [];
    private _activeCameraId: number = -1;

    private _moveStepSize: number = 0.5;
    private _scaleMultiplier: number = 1.1;

    constructor(camera: Camera) {
        this.addCamera(camera);
        this.setActiveCamera(camera.id);

        this.setupListener();
    }

    public getActiveCamera(): Camera {
        return this._cameras.find(camera => camera.id == this._activeCameraId);
    }

    public getActiveCameraIndex(): number {
        return this._cameras.findIndex(camera => camera.id == this._activeCameraId);
    }

    public setActiveCamera(id: number) {
        this._activeCameraId = id;
    }

    public addCamera(camera: Camera): void {
        if (this._cameras.findIndex(existingCamera => existingCamera.id == camera.id) != -1) {
            console.error("Camera already added to controller.")
            return;
        }
        this._cameras.push(camera);
    }

    private setupListener() {
        window.addEventListener('keydown', (event) => {
            let cameraVal = this.getActiveCamera();
            let cameraIndex = this.getActiveCameraIndex();

            switch (event.key) {
                case "Down": // IE/Edge specific value
                case "ArrowDown":
                    this._cameras[cameraIndex].vel.add(new Vector2(0, this._moveStepSize / cameraVal.scale));
                    break;
        
                case "Up": // IE/Edge specific value
                case "ArrowUp":
                    this._cameras[cameraIndex].vel.add(new Vector2(0, -this._moveStepSize / cameraVal.scale));
                    break;
        
                case "Left": // IE/Edge specific value
                case "ArrowLeft":
                    this._cameras[cameraIndex].vel.add(new Vector2(-this._moveStepSize / cameraVal.scale, 0));
                    break;
                    
                case "Right": // IE/Edge specific value
                case "ArrowRight":
                    this._cameras[cameraIndex].vel.add(new Vector2(this._moveStepSize / cameraVal.scale, 0));
                    break;

                case "=":
                    this._cameras[cameraIndex].scale = this._cameras[cameraIndex].scale * this._scaleMultiplier;
                    break;
                case "-":
                    if (cameraVal.scale / this._scaleMultiplier > 0.000001) {
                        this._cameras[cameraIndex].scale = this._cameras[cameraIndex].scale / this._scaleMultiplier;
                    }
                    break;
                
                case "s":
                    this._cameras[cameraIndex].toggleSmoothMovement();
                    break;
                
                case "/":
                    Game.togglePause();
                    break;
            }
        });
    }
}

