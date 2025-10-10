type IDItem = { id: number };

export default class CycleList<T extends IDItem> {
  private _items: T[] = [];
  private _activeIndex: number = -1;

  public getActiveItem(): T | undefined {
    if (this._activeIndex == -1) return undefined;

    return this._items[this._activeIndex];
  }

  private getItemIndexById(id: number) {
    const index = this._items.findIndex((item) => item.id == id);

    if (index == -1) {
      console.error('Could not find item with index', id);
      return;
    }
    return index;
  }

  public setActiveItem(id: number) {
    const index = this.getItemIndexById(id);
    if (!index) return;

    this._activeIndex = index;
  }

  public add(item: T) {
    if (this.getItemIndexById(item.id) != -1) {
      console.error(`Item with ID ${item.id} already added to controller.`);
      return;
    }
    this._items.push(item);
  }

  public remove(id: number) {
    // TODO: implement
  }

  public increment() {
    if (this._activeIndex < this._items.length - 1) {
      this._activeIndex++;
    } else {
      this._activeIndex = 0;
    }
  }

  public decrement() {
    if (this._activeIndex > 0) {
      this._activeIndex--;
    } else {
      this._activeIndex = this._items.length;
    }
  }
}
