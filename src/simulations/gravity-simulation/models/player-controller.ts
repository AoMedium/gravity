import type Camera from './camera';
import Vector2 from './vector2';

export default class PlayerController {
  private _cameras: Camera[] = [];
  private _activeCameraId: number = -1;

  private _moveStepSize: number = 0.5;
  private _scaleMultiplier: number = 1.1;

  constructor(camera: Camera) {
    this.addCamera(camera);
    this.setActiveCamera(camera.id);
  }

  public getActiveCamera(): Camera | undefined {
    return this._cameras.find((camera) => camera.id == this._activeCameraId);
  }

  public getActiveCameraIndex(): number {
    return this._cameras.findIndex(
      (camera) => camera.id == this._activeCameraId,
    );
  }

  public setActiveCamera(id: number) {
    this._activeCameraId = id;
  }

  public addCamera(camera: Camera): void {
    if (
      this._cameras.findIndex(
        (existingCamera) => existingCamera.id == camera.id,
      ) != -1
    ) {
      console.error('Camera already added to controller.');
      return;
    }
    this._cameras.push(camera);
  }

  public handleInput(key: string) {
    const camera = this.getActiveCamera();
    if (!camera) return;

    const cameraIndex = this.getActiveCameraIndex();

    switch (key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        this._cameras[cameraIndex].velocity.add(
          new Vector2(0, this._moveStepSize / camera.scale),
        );
        break;

      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        this._cameras[cameraIndex].velocity.add(
          new Vector2(0, -this._moveStepSize / camera.scale),
        );
        break;

      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
        this._cameras[cameraIndex].velocity.add(
          new Vector2(-this._moveStepSize / camera.scale, 0),
        );
        break;

      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        this._cameras[cameraIndex].velocity.add(
          new Vector2(this._moveStepSize / camera.scale, 0),
        );
        break;

      case '=':
        this._cameras[cameraIndex].scale =
          this._cameras[cameraIndex].scale * this._scaleMultiplier;
        break;
      case '-':
        if (camera.scale / this._scaleMultiplier > 0.000001) {
          this._cameras[cameraIndex].scale =
            this._cameras[cameraIndex].scale / this._scaleMultiplier;
        }
        break;

      case 's':
        this._cameras[cameraIndex].toggleSmoothMovement();
        break;
    }
  }
}
