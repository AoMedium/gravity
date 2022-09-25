class Game {
    private static useForceFrames: boolean = false;
    private static fps: number = 15; // default fps
    private static tick: number = 0;

    private static frameIntervalId: number;

    public static start(): void {
        if (this.useForceFrames) {
            this.frameIntervalId = setInterval(Game.update, 1000/this.fps);
        } else {
            window.requestAnimationFrame(Game.update);
        }
    }

    public static stop(): void {
        clearInterval(this.frameIntervalId);
    }

    private static update(): void {
        Game.clear();
        Game.render();

        Game.tick++;
    }

    public static render(): void {}

    public static clear(): void {}

    public static getTick(): number {
        return this.tick;
    }

    public static setFPS(fps: number) {
        Game.useForceFrames = true;
        Game.fps = fps;
    }

}