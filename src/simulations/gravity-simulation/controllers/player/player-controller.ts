import type InputHandler from '@/features/simulation/util/input-handler';
import GravitySimulation from '../../gravity-simulation';
import type Entity from '../../models/entity/entity';
import Vector2 from '../../models/vector2';
import CycleList from '../../utils/cycle-list';
import type CameraController from '../camera/camera-controller';
import Canvas from '../../utils/canvas';
import GravityObject from '../../models/entity/gravity-object';
import CameraActions from '../../models/system/actions/camera-actions';
import SimulationActions from '../../models/system/actions/simulation-actions';
import PlayerControls from '../../models/system/controls/player-controls';
import type Action from '../../utils/action';
import type Camera from '../camera/camera';

export default class PlayerController implements InputHandler {
  private _controls: PlayerControls = new PlayerControls();
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
      // Do not process a key multiple times
      return;
    }

    this.lockKey(key);
    this.handleSingleInput(key);
  }

  public keyup(key: string) {
    this.unlockKey(key);
  }

  public trigger(action: Action) {
    this.handleTrigger(action);
  }

  public mousedown(event: MouseEvent) {
    const camera = this._cameraController.getActiveItem();
    if (!camera) return;

    const position = Canvas.getPhysicalPosition(
      new Vector2(event.clientX, event.clientY),
      camera,
    );

    GravitySimulation.entityController.entities.add(
      new GravityObject({ name: 'Roid', position: position, mass: 10 }),
    );
  }

  public handleContinuousInput() {
    if (this._activeKeys.size == 0) return;

    const camera = this._cameraController.getActiveItem();
    if (!camera) return;

    for (const key of this._activeKeys) {
      const action = this._controls.active.get(key);
      if (!action) continue;

      switch (action.name) {
        case CameraActions.zoomIn.name:
          camera.scale = camera.scale * this._scaleMultiplier;
          break;
        case CameraActions.zoomOut.name:
          if (camera.scale / this._scaleMultiplier > 0.000001) {
            camera.scale = camera.scale / this._scaleMultiplier;
          }
          break;
      }

      if (!this._isTargeting) {
        switch (action.name) {
          case CameraActions.moveDown.name:
            camera.velocity.add(
              new Vector2(0, -this._moveStepSize / camera.scale),
            );
            break;
          case CameraActions.moveUp.name:
            camera.velocity.add(
              new Vector2(0, this._moveStepSize / camera.scale),
            );
            break;
          case CameraActions.moveLeft.name:
            camera.velocity.add(
              new Vector2(-this._moveStepSize / camera.scale, 0),
            );
            break;
          case CameraActions.moveRight.name:
            camera.velocity.add(
              new Vector2(this._moveStepSize / camera.scale, 0),
            );
            break;
        }
      }
    }
  }

  public handleSingleInput(key: string) {
    const action = this._controls.active.get(key);
    if (!action) return;

    this.handleTrigger(action);
  }

  public handleTrigger(action: Action) {
    const camera = this._cameraController.getActiveItem();
    if (!camera) return;

    switch (action.name) {
      case CameraActions.previousCamera.name:
        this._cameraController.decrement();
        break;

      case CameraActions.nextCamera.name:
        this._cameraController.increment();
        break;

      case CameraActions.toggleSmoothMovement.name:
        camera.toggleSmoothMovement();
        break;
      case CameraActions.toggleTargeting.name:
        this.toggleTargeting(camera);
        break;

      case SimulationActions.togglePause.name:
        GravitySimulation.togglePaused();
        break;

      case SimulationActions.toggleTrails.name:
        GravitySimulation.settings.gravityObject.showTrails =
          !GravitySimulation.settings.gravityObject.showTrails;
        break;
      case CameraActions.toggleCursor.name:
        GravitySimulation.settings.view.showCursor =
          !GravitySimulation.settings.view.showCursor;
        break;
      case CameraActions.toggleTargetCursor.name:
        GravitySimulation.settings.view.showTargetCursor =
          !GravitySimulation.settings.view.showTargetCursor;
        break;
    }

    if (this._isTargeting) {
      switch (action.name) {
        case CameraActions.previousTarget.name:
          this._targets.decrement();
          this._cameraController.setTarget(this._targets.getActiveItem());
          break;

        case CameraActions.nextTarget.name:
          this._targets.increment();
          this._cameraController.setTarget(this._targets.getActiveItem());
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

  private toggleTargeting(camera: Camera) {
    this._isTargeting = !this._isTargeting;

    if (this._isTargeting) {
      this._controls.setMode('targeting');

      const target = this._targets.getActiveItem();
      if (!target) return;

      this._cameraController.setTarget(target);
    } else {
      this._controls.setMode('default');

      this._cameraController.clearTarget();
      camera.velocity = Vector2.zero();
    }
  }
}
