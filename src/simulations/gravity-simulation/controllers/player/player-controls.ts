// https://www.toptal.com/developers/keycode

import Control from '@/features/simulation/util/control';

export default class PlayerControls {
  simulation: SimulationControls = new SimulationControls();
  camera: CameraControls = new CameraControls();
}

class SimulationControls {
  togglePause: Control = new Control('/', 'Toggle Pause');
  toggleTrails: Control = new Control('`', 'Toggle Trails');
}

class CameraControls {
  moveUp: Control = new Control('ArrowUp', 'Move Up');
  moveDown: Control = new Control('ArrowDown', 'Move Down');
  moveLeft: Control = new Control('ArrowLeft', 'Move Left');
  moveRight: Control = new Control('ArrowRight', 'Move Right');

  zoomIn: Control = new Control('=', 'Zoom In');
  zoomOut: Control = new Control('-', 'Zoom Out');

  previousCamera: Control = new Control('[', 'Previous Camera');
  nextCamera: Control = new Control(']', 'Next Camera');

  previousTarget: Control = new Control('ArrowLeft', 'Previous Target');
  nextTarget: Control = new Control('ArrowRight', 'Next Target');

  toggleSmoothMovement: Control = new Control('s', 'Toggle Smooth Movement');
  toggleTargeting: Control = new Control('t', 'Toggle Targeting');
}
