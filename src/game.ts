export class Game {
    private static _useForceFrames: boolean = false;
    private static _fps: number = 15; // default fps
    private static _tick: number = 0;
    private static _isPaused: boolean = false;

    private static frameIntervalId: number;

    public static start(): void {
        if (this._useForceFrames) {
            this.frameIntervalId = setInterval(Game.update, 1000/this._fps);
        } else {
            window.requestAnimationFrame(Game.update);
        }
    }

    public static stop(): void {
        clearInterval(this.frameIntervalId);
    }

    public static togglePause(): void {
        Game._isPaused = !Game._isPaused;
    }

    static get isPaused() {
        return Game._isPaused;
    }

    private static update(): void {
        Game.clear();
        Game.nextFrame();

        Game._tick++;
    }

    public static nextFrame(): void {}

    public static clear(): void {}

    public static getTick(): number {
        return this._tick;
    }

    public static setFPS(fps: number) {
        Game._useForceFrames = true;
        Game._fps = fps;
    }

}