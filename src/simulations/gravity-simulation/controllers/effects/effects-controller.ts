import type Effect from '../../models/overlay/effect';
import List from '../../utils/list';

export default class EffectsController {
  public effects: List<Effect> = new List();
}
