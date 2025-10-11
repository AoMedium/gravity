import EventBus from '@/features/events/event-bus';

// TODO: consider whether this should be a singleton
export default abstract class Simulation {
  public static context: CanvasRenderingContext2D | null;
  public static eventBus: EventBus = EventBus.getInstance();
  protected static isInitialized: boolean = false;

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

  public abstract keydown(key: string): void;

  public abstract keyup(key: string): void;
}
