import OutputData from './output-data';

export default abstract class Simulation {
  public static context: CanvasRenderingContext2D | null;
  public static output: OutputData = new OutputData();

  private _window: Window;
  public fps: number;

  constructor(window: Window) {
    this._window = window;
    this.fps = 60;
  }

  public get window() {
    return this._window;
  }

  public abstract init(): void;

  public abstract update(): void;

  public abstract draw(context: CanvasRenderingContext2D): void;

  public abstract handleInput(key: string): void;
}
