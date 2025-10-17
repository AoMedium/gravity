import type Entity from '../../models/entity/entity';
import TargetCursor from '../../models/overlay/ui/cursors/target-cursor';
import CycleList from '../../utils/cycle-list';
import type Camera from './camera';

export default class CameraController extends CycleList<Camera> {
  public targetCursor: TargetCursor;

  constructor(camera: Camera) {
    super();
    this.add(camera);
    this.setActiveItem(camera.id);
    this.targetCursor = new TargetCursor();
  }

  public setTarget(target: Entity | undefined) {
    const camera = this.getActiveItem();
    if (!camera || !target) return;

    camera.target = target;
    this.targetCursor.setTarget(target); // TODO: test if ref is cleared on delete
  }
}
