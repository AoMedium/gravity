import type Effect from '../../models/overlay/effect';
import List from '../../utils/list';

export default class EffectsController {
  public effects: List<Effect> = new List();

  public update() {
    for (let i = 0; i < this.effects.length; i++) {
      this.effects.getIndex(i).update();
    }
  }

  public draw() {
    for (let i = 0; i < this.effects.length; i++) {
      this.effects.getIndex(i).draw();
    }
  }
}
