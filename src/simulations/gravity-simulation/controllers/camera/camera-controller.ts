import GravitySimulation from '../../gravity-simulation';
import type Entity from '../../models/entity/entity';
import Cursor from '../../models/overlay/ui/cursors/cursor';
import TargetCursor from '../../models/overlay/ui/cursors/target-cursor';
import Vector2 from '../../models/vector2';
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

  public update() {
    const camera = this.getActiveItem();
    if (camera) camera.update();
  }

  public draw() {
    const camera = this.getActiveItem();
    if (!camera) return;

    if (GravitySimulation.settings.view.showTargetCursor) {
      this.targetCursor.draw();
    }

    if (GravitySimulation.settings.view.showCursor) {
      Cursor.draw(new Vector2(innerWidth / 2, innerHeight / 2), 10, '#fff');
    }
  }

  public setTarget(target: Entity | undefined) {
    const camera = this.getActiveItem();
    if (!camera || !target) return;

    camera.target = target;
    this.targetCursor.setTarget(target); // TODO: test if ref is cleared on delete
  }

  public clearTarget() {
    const camera = this.getActiveItem();
    if (!camera) return;

    camera.clearTarget();
    this.targetCursor.clearTarget();
  }
}
