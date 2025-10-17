import Canvas from '@/simulations/gravity-simulation/utils/canvas';
import type Entity from '../../../entity/entity';
import GravityObject from '../../../entity/gravity-object';
import type Vector2 from '../../../vector2';
import Cursor from './cursor';
import GravitySimulation from '@/simulations/gravity-simulation/gravity-simulation';

export default class TargetCursor extends Cursor {
  private target: Entity | null = null;

  public draw() {
    if (!this.target) return;

    const camera = GravitySimulation.cameraController.getActiveItem();
    if (!camera) return;

    const renderPosition: Vector2 = Canvas.getRenderPosition(
      this.target.position,
      camera,
    );

    const color =
      this.target instanceof GravityObject
        ? this.target.attributes.primaryColor
        : '#aaa';

    Cursor.draw(renderPosition, 8, color);
  }

  public setTarget(target: Entity) {
    this.target = target;
  }

  public clearTarget() {
    this.target = null;
  }
}
