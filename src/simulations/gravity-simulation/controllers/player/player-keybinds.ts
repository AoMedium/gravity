export default class PlayerKeyBinds {
  simulation: SimulationKeyBinds = new SimulationKeyBinds();
  camera: CameraKeyBinds = new CameraKeyBinds();
}

class SimulationKeyBinds {
  togglePause: KeyBind = new KeyBind('/', 'Toggle Pause');
}

class CameraKeyBinds {
  moveUp: KeyBind = new KeyBind('ArrowUp', 'Move Up');
  moveDown: KeyBind = new KeyBind('ArrowDown', 'Move Down');
  moveLeft: KeyBind = new KeyBind('ArrowLeft', 'Move Left');
  moveRight: KeyBind = new KeyBind('ArrowRight', 'Move Right');

  zoomIn: KeyBind = new KeyBind('=', 'Zoom In');
  zoomOut: KeyBind = new KeyBind('-', 'Zoom Out');

  previousCamera: KeyBind = new KeyBind('[', 'Previous Camera');
  nextCamera: KeyBind = new KeyBind(']', 'Next Camera');

  previousTarget: KeyBind = new KeyBind('ArrowLeft', 'Previous Target');
  nextTarget: KeyBind = new KeyBind('ArrowRight', 'Next Target');

  toggleSmoothMovement: KeyBind = new KeyBind('s', 'Toggle Smooth Movement');
  toggleTargeting: KeyBind = new KeyBind('t', 'Toggle Targeting');
}

class KeyBind {
  public key: string;
  public functionality: string | undefined;

  constructor(key: string, functionality?: string) {
    this.key = key;
    this.functionality = functionality;
  }
}
