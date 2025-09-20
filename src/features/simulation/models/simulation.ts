export default abstract class Simulation {
  private _window: Window;
  private _updateInterval: NodeJS.Timeout | undefined;

  public fps: number;

  constructor(window: Window) {
    this._window = window;
    this.fps = 60;
  }

  public get window() {
    return this._window;
  }

  public abstract update(): void;

  public abstract draw(context: CanvasRenderingContext2D): void;
}
