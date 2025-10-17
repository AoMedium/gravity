import Action from '../system/action';

export default class ControlMap {
  private controls: Map<string, Action> = new Map();

  public add(key: string, action: Action) {
    this.controls.set(key, action);
  }

  public get(key: string) {
    return this.controls.get(key);
  }
}
