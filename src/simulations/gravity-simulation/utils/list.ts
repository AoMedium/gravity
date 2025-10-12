export type IDItem = { id: number };

export default class List<T extends IDItem> {
  protected items: T[] = [];

  public get length() {
    return this.items.length;
  }

  public add(item: T) {
    if (this.getItemIndexById(item.id) != -1) {
      console.error(`Item with ID ${item.id} already added to list.`);
      return;
    }
    this.items.push(item);
  }

  public remove(id: number): T | undefined {
    const index = this.getItemIndexById(id);
    if (index == -1) return;

    return this.items.splice(index, 1)[0];
  }

  public getIndex(index: number) {
    return this.items[index];
  }

  public setRef(items: T[]) {
    this.items = items;
  }

  public getRef() {
    return this.items;
  }

  protected getItemIndexById(id: number) {
    return this.items.findIndex((item) => item.id == id);
  }
}
