import GravitySimulation from '../gravity-simulation';
import type Camera from './camera';
import CameraController from './camera-controller';
import Vector2 from './vector2';

export default class PlayerController {
  private _cameraController: CameraController = new CameraController();

  private _moveStepSize: number = 1;
  private _scaleMultiplier: number = 1.1;

  private _activeKeys: Set<string> = new Set();

  private _isTargeting: boolean = false;

  constructor(camera: Camera) {
    this._cameraController.addCamera(camera);
    this._cameraController.setActiveCamera(camera.id);
  }

  public keydown(key: string) {
    this._activeKeys.add(key);
    this.handleSingleInput(key);
  }

  public keyup(key: string) {
    this._activeKeys.delete(key);
  }

  public handleContinuousInput() {
    if (this._activeKeys.size == 0) return;

    const camera = this._cameraController.getActiveCamera();
    if (!camera) return;

    for (const key of this._activeKeys) {
      switch (key) {
        case '=':
          camera.scale = camera.scale * this._scaleMultiplier;
          break;
        case '-':
          if (camera.scale / this._scaleMultiplier > 0.000001) {
            camera.scale = camera.scale / this._scaleMultiplier;
          }
          break;
      }

      if (!this._isTargeting) {
        switch (key) {
          case 'Down': // IE/Edge specific value
          case 'ArrowDown':
            camera.velocity.add(
              new Vector2(0, this._moveStepSize / camera.scale),
            );
            break;

          case 'Up': // IE/Edge specific value
          case 'ArrowUp':
            camera.velocity.add(
              new Vector2(0, -this._moveStepSize / camera.scale),
            );
            break;

          case 'Left': // IE/Edge specific value
          case 'ArrowLeft':
            camera.velocity.add(
              new Vector2(-this._moveStepSize / camera.scale, 0),
            );
            break;

          case 'Right': // IE/Edge specific value
          case 'ArrowRight':
            camera.velocity.add(
              new Vector2(this._moveStepSize / camera.scale, 0),
            );
            break;
        }
      }
    }
  }

  public handleSingleInput(key: string) {
    const camera = this._cameraController.getActiveCamera();
    if (!camera) return;

    switch (key) {
      case '[':
        // TODO: cycle between cameras
        this._cameraController.decrement();
        break;

      case ']':
        this._cameraController.increment();
        break;

      case 's':
        camera.toggleSmoothMovement();
        break;

      case '/':
        GravitySimulation.togglePaused();
        break;
    }

    if (this._isTargeting) {
      switch (key) {
        case 'Left': // IE/Edge specific value
        case 'ArrowLeft':
          break;

        case 'Right': // IE/Edge specific value
        case 'ArrowRight':
          break;
      }
    }
  }
}
