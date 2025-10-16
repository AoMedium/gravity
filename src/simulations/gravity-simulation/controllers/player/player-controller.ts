import type InputHandler from '@/features/simulation/util/input-handler';
import GravitySimulation from '../../gravity-simulation';
import type Entity from '../../models/entity/entity';
import Vector2 from '../../models/vector2';
import CycleList from '../../utils/cycle-list';
import type CameraController from '../camera/camera-controller';
import PlayerControls from './player-controls';
import Canvas from '../../utils/canvas';
import GravityObject from '../../models/entity/gravity-object';
import type Control from '@/features/simulation/util/control';

export default class PlayerController implements InputHandler {
  public controls: PlayerControls = new PlayerControls();

  private _cameraController: CameraController;
  private _moveStepSize: number = 1;
  private _scaleMultiplier: number = 1.1;

  private _activeKeys: Set<string> = new Set();

  private _targets: CycleList<Entity> = new CycleList();
  private _isTargeting: boolean = false;

  constructor(cameraController: CameraController, targets: Entity[]) {
    this._cameraController = cameraController;
    this._targets.setRef(targets);
  }

  public keydown(key: string) {
    if (this._activeKeys.has(key)) {
      return;
    } else {
      this.lockKey(key);
    }
    this.handleSingleInput(key);
  }

  public keyup(key: string) {
    this.unlockKey(key);
  }

  public trigger(control: Control) {
    this.handleSingleInput(control.key);
  }

  public mousedown(event: MouseEvent) {
    const camera = this._cameraController.getActiveItem();
    if (!camera) return;

    const position = Canvas.getPhysicalPosition(
      new Vector2(event.clientX, event.clientY),
      camera,
    );

    GravitySimulation.entities.add(
      new GravityObject({ name: 'Roid', position: position, mass: 10 }),
    );
  }

  public handleContinuousInput() {
    if (this._activeKeys.size == 0) return;

    const camera = this._cameraController.getActiveItem();
    if (!camera) return;

    for (const key of this._activeKeys) {
      switch (key) {
        case this.controls.camera.zoomIn.key:
          camera.scale = camera.scale * this._scaleMultiplier;
          break;
        case this.controls.camera.zoomOut.key:
          if (camera.scale / this._scaleMultiplier > 0.000001) {
            camera.scale = camera.scale / this._scaleMultiplier;
          }
          break;
      }

      if (!this._isTargeting) {
        switch (key) {
          case this.controls.camera.moveDown.key:
            camera.velocity.add(
              new Vector2(0, -this._moveStepSize / camera.scale),
            );
            break;
          case this.controls.camera.moveUp.key:
            camera.velocity.add(
              new Vector2(0, this._moveStepSize / camera.scale),
            );
            break;
          case this.controls.camera.moveLeft.key:
            camera.velocity.add(
              new Vector2(-this._moveStepSize / camera.scale, 0),
            );
            break;
          case this.controls.camera.moveRight.key:
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

    const camera = this._cameraController.getActiveItem();
    if (!camera) return;

    switch (key) {
      case this.controls.camera.previousCamera.key:
        this._cameraController.decrement();
        break;

      case this.controls.camera.nextCamera.key:
        this._cameraController.increment();
        break;

      case this.controls.camera.toggleSmoothMovement.key:
        camera.toggleSmoothMovement();
        break;
      case this.controls.camera.toggleTargeting.key:
        this._isTargeting = !this._isTargeting;

        if (this._isTargeting) {
          camera.target = this._targets.getActiveItem();
        } else {
          camera.clearTarget();
          camera.velocity = Vector2.zero();
        }
        break;

      case this.controls.simulation.togglePause.key:
        GravitySimulation.togglePaused();
        break;

      case this.controls.simulation.toggleTrails.key:
        GravitySimulation.settings.gravityObject.showTrails =
          !GravitySimulation.settings.gravityObject.showTrails;
        break;
    }

    if (this._isTargeting) {
      switch (key) {
        case this.controls.camera.previousTarget.key:
          this._targets.decrement();
          camera.target = this._targets.getActiveItem();
          break;

        case this.controls.camera.nextTarget.key:
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
