type IDItem = { id: number };

export default class CycleList<T extends IDItem> {
  public items: T[] = [];
  private _activeIndex: number = -1;

  public getActiveItem(): T | undefined {
    if (this._activeIndex == -1) return undefined;

    return this.items[this._activeIndex];
  }

  public setActiveItem(id: number) {
    const index = this.getItemIndexById(id);
    if (index == -1) return;

    this._activeIndex = index;
  }

  public add(item: T) {
    if (this.getItemIndexById(item.id) != -1) {
      console.error(`Item with ID ${item.id} already added to controller.`);
      return;
    }
    this.items.push(item);
  }

  public remove(id: number): T | undefined {
    const index = this.getItemIndexById(id);
    if (index == -1) return;

    return this.items.splice(index, 1)[0];
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

  private getItemIndexById(id: number) {
    return this.items.findIndex((item) => item.id == id);
  }
}
