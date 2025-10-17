import type Entity from '../../models/entity/entity';
import List from '../../utils/list';

export default class EntityController {
  public entities: List<Entity> = new List();

  public update() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities.getIndex(i).update();
    }
  }

  public draw() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities.getIndex(i).draw();
    }
  }
}
