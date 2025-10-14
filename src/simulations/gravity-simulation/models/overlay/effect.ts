import { IDItem } from '../../utils/list';

export default abstract class Effect extends IDItem {
  public frame: number = 0;
  public maxFrame: number = 0;

  constructor(maxFrame: number) {
    super();
    this.maxFrame = maxFrame;
  }

  public increment() {
    if (this.frame < this.maxFrame) this.frame++;
  }

  public decrement() {
    if (this.frame > 0) this.frame--;
  }

  public get isFinished() {
    return this.frame == this.maxFrame;
  }

  public abstract update(): void;
  public abstract draw(): void;
}
