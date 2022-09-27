import { Vector2 } from "./models.js";
export class Camera {
    constructor(pos) {
        this._scale = 1;
        this._id = Math.random();
        this._pos = pos || Vector2.zero();
    }
    get id() {
        return this._id;
    }
    get pos() {
        return this._pos;
    }
    set pos(pos) {
        this._pos = pos;
    }
    get scale() {
        return this._scale;
    }
    set scale(scale) {
        if (scale <= 0) {
            console.error("Cannot have a scale less than 0");
            return;
        }
        this._scale = scale;
    }
}
export class PlayerController {
    constructor(camera) {
        this._cameras = [];
        this._activeCameraId = -1;
        this._moveStepSize = 10;
        this._scaleMultiplier = 1.1;
        this.addCamera(camera);
        this.setActiveCamera(camera.id);
        this.setupListener();
    }
    getActiveCamera() {
        return this._cameras.find(camera => camera.id == this._activeCameraId);
    }
    getActiveCameraIndex() {
        return this._cameras.findIndex(camera => camera.id == this._activeCameraId);
    }
    setActiveCamera(id) {
        this._activeCameraId = id;
    }
    addCamera(camera) {
        if (this._cameras.findIndex(existingCamera => existingCamera.id == camera.id) != -1) {
            console.error("Camera already added to controller.");
            return;
        }
        this._cameras.push(camera);
    }
    setupListener() {
        window.addEventListener('keydown', (event) => {
            let cameraVal = this.getActiveCamera();
            let cameraIndex = this.getActiveCameraIndex();
            switch (event.key) {
                case "Down": // IE/Edge specific value
                case "ArrowDown":
                    this._cameras[cameraIndex].pos.add(new Vector2(0, this._moveStepSize / cameraVal.scale));
                    break;
                case "Up": // IE/Edge specific value
                case "ArrowUp":
                    this._cameras[cameraIndex].pos.add(new Vector2(0, -this._moveStepSize / cameraVal.scale));
                    break;
                case "Left": // IE/Edge specific value
                case "ArrowLeft":
                    this._cameras[cameraIndex].pos.add(new Vector2(-this._moveStepSize / cameraVal.scale, 0));
                    break;
                case "Right": // IE/Edge specific value
                case "ArrowRight":
                    this._cameras[cameraIndex].pos.add(new Vector2(this._moveStepSize / cameraVal.scale, 0));
                    break;
                case "=":
                    this._cameras[cameraIndex].scale = this._cameras[cameraIndex].scale * this._scaleMultiplier;
                    break;
                case "-":
                    if (cameraVal.scale / this._scaleMultiplier > 0.000001) {
                        this._cameras[cameraIndex].scale = this._cameras[cameraIndex].scale / this._scaleMultiplier;
                    }
                    break;
            }
        });
    }
}
//# sourceMappingURL=input.js.map