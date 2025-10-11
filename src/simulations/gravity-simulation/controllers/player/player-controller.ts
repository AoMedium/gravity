import GravitySimulation from '../../gravity-simulation';
import type Entity from '../../models/entity/entity';
import Vector2 from '../../models/vector2';
import CycleList from '../../utils/cycle-list';
import type CameraController from '../camera/camera-controller';
import PlayerKeyBinds from './player-keybinds';

export default class PlayerController {
  private _keyBinds: PlayerKeyBinds = new PlayerKeyBinds();
  private _cameraController: CameraController;
  private _moveStepSize: number = 1;
  private _scaleMultiplier: number = 1.1;

  private _activeKeys: Set<string> = new Set();

  private _targets: CycleList<Entity> = new CycleList();
  private _isTargeting: boolean = false;

  constructor(cameraController: CameraController, targets: Entity[]) {
    this._cameraController = cameraController;
    this._targets.items = targets; // FIXME: targets.items does not change when targets is updated external to this class
  }

  public keydown(key: string) {
    if (this._activeKeys.has(key)) return;

    this.handleSingleInput(key);
  }

  public keyup(key: string) {
    this.unlockKey(key);
  }

  public handleContinuousInput() {
    if (this._activeKeys.size == 0) return;

    const camera = this._cameraController.getActiveItem();
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
          case this._keyBinds.camera.moveDown.key:
            camera.velocity.add(
              new Vector2(0, this._moveStepSize / camera.scale),
            );
            break;
          case this._keyBinds.camera.moveUp.key:
            camera.velocity.add(
              new Vector2(0, -this._moveStepSize / camera.scale),
            );
            break;
          case this._keyBinds.camera.moveLeft.key:
            camera.velocity.add(
              new Vector2(-this._moveStepSize / camera.scale, 0),
            );
            break;
          case this._keyBinds.camera.moveRight.key:
            camera.velocity.add(
              new Vector2(this._moveStepSize / camera.scale, 0),
            );
            break;
        }
      }
    }
  }

  public handleSingleInput(key: string) {
    // Lock and unlock key so that we do not process single inputs for a key multiple times
    if (this._activeKeys.has(key)) {
      return;
    } else {
      this.lockKey(key);
    }

    const camera = this._cameraController.getActiveItem();
    if (!camera) return;

    switch (key) {
      case this._keyBinds.camera.previousCamera.key:
        this._cameraController.decrement();
        break;

      case this._keyBinds.camera.nextCamera.key:
        this._cameraController.increment();
        break;

      case this._keyBinds.camera.toggleSmoothMovement.key:
        camera.toggleSmoothMovement();
        break;
      case this._keyBinds.camera.toggleTargeting.key:
        this._isTargeting = !this._isTargeting;

        if (this._isTargeting) {
          camera.target = this._targets.getActiveItem();
        } else {
          camera.clearTarget();
          camera.velocity = Vector2.zero();
        }
        break;

      case this._keyBinds.simulation.togglePause.key:
        GravitySimulation.togglePaused();
        break;
    }

    if (this._isTargeting) {
      switch (key) {
        case this._keyBinds.camera.previousTarget.key:
          this._targets.decrement();
          camera.target = this._targets.getActiveItem();
          break;

        case this._keyBinds.camera.nextTarget.key:
          this._targets.increment();
          camera.target = this._targets.getActiveItem();
          break;
      }
    }
  }

  private lockKey(key: string) {
    this._activeKeys.add(key);
  }

  private unlockKey(key: string) {
    this._activeKeys.delete(key);
  }
}
