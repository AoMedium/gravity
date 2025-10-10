export default class OutputData {
  private _entries: Map<string, unknown>;

  constructor() {
    this._entries = new Map();
  }

  public set(key: string, value: unknown) {
    this._entries.set(key, value);
  }

  public get(key: string) {
    const value = this._entries.get(key);

    if (!value) {
      console.error('Could not retrieve output value with key: ', key);
    }

    return value;
  }

  public get entries() {
    return this._entries;
  }
}
