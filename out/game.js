export class Game {
    static start() {
        if (this.useForceFrames) {
            this.frameIntervalId = setInterval(Game.update, 1000 / this.fps);
        }
        else {
            window.requestAnimationFrame(Game.update);
        }
    }
    static stop() {
        clearInterval(this.frameIntervalId);
    }
    static update() {
        Game.clear();
        Game.render();
        Game.tick++;
    }
    static render() { }
    static clear() { }
    static getTick() {
        return this.tick;
    }
    static setFPS(fps) {
        Game.useForceFrames = true;
        Game.fps = fps;
    }
}
Game.useForceFrames = false;
Game.fps = 15; // default fps
Game.tick = 0;
//# sourceMappingURL=game.js.map