import type { IDItem } from './list';
import List from './list';

export default class CycleList<T extends IDItem> extends List<T> {
  private _activeIndex: number = 0;

  public getActiveItem(): T | undefined {
    return this.items[this._activeIndex];
  }

  public setActiveItem(id: number) {
    const index = this.getItemIndexById(id);
    if (index == -1) return;

    this._activeIndex = index;
  }

  public increment() {
    if (this._activeIndex < this.items.length - 1) {
      this._activeIndex++;
    } else {
      this._activeIndex = 0;
    }
  }

  public decrement() {
    if (this._activeIndex > 0) {
      this._activeIndex--;
    } else {
      this._activeIndex = this.items.length - 1;
    }
  }
}
