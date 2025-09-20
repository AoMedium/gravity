export default abstract class Simulation {
  private _window: Window;

  constructor(window: Window) {
    this._window = window;
  }

  public get window() {
    return this._window;
  }

  public abstract update(): void;

  public abstract draw(context: CanvasRenderingContext2D): void;
}
