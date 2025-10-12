export type IDItem = { id: number };
export default class List<T extends IDItem> {
  public items: T[] = [];

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

  protected getItemIndexById(id: number) {
    return this.items.findIndex((item) => item.id == id);
  }
}
