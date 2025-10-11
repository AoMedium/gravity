import CycleList from '../../utils/cycle-list';
import type Camera from './camera';

export default class CameraController extends CycleList<Camera> {
  constructor(camera: Camera) {
    super();
    this.add(camera);
    this.setActiveItem(camera.id);
  }
}
