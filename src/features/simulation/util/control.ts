export default class Control {
  public key: string;
  public functionality: string | undefined;

  constructor(key: string, functionality?: string) {
    this.key = key;
    this.functionality = functionality;
  }
}
