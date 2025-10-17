import CameraActions from '../actions/camera-actions';
import SimulationActions from '../actions/simulation-actions';
import ControlMap from '../../../utils/control-map';

export default class PlayerControls {
  public active: ControlMap = new ControlMap();

  constructor() {
    this.reset();
  }

  public setMode(mode: ControlMode) {
    switch (mode) {
      case 'default':
        this.reset();
        break;
      case 'targeting':
        this.targetingOverride();
        break;
    }
  }

  private reset() {
    this.active.add('ArrowUp', CameraActions.moveUp);
    this.active.add('ArrowDown', CameraActions.moveDown);
    this.active.add('ArrowLeft', CameraActions.moveLeft);
    this.active.add('ArrowRight', CameraActions.moveRight);
    this.active.add('=', CameraActions.zoomIn);
    this.active.add('-', CameraActions.zoomOut);
    this.active.add('[', CameraActions.previousCamera);
    this.active.add(']', CameraActions.nextCamera);
    this.active.add('s', CameraActions.toggleSmoothMovement);
    this.active.add('t', CameraActions.toggleTargeting);

    this.active.add('/', SimulationActions.togglePause);
    this.active.add('`', SimulationActions.toggleTrails);
  }

  private targetingOverride() {
    this.active.add('ArrowLeft', CameraActions.previousTarget);
    this.active.add('ArrowRight', CameraActions.nextTarget);
  }
}

export type ControlMode = 'default' | 'targeting';
