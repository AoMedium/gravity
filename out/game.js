export class Game {
    static start() {
        if (this._useForceFrames) {
            this.frameIntervalId = setInterval(Game.update, 1000 / this._fps);
        }
        else {
            window.requestAnimationFrame(Game.update);
        }
    }
    static stop() {
        clearInterval(this.frameIntervalId);
    }
    static togglePause() {
        Game._isPaused = !Game._isPaused;
    }
    static get isPaused() {
        return Game._isPaused;
    }
    static update() {
        Game.clear();
        Game.nextFrame();
        Game._tick++;
    }
    static nextFrame() { }
    static clear() { }
    static getTick() {
        return this._tick;
    }
    static setFPS(fps) {
        Game._useForceFrames = true;
        Game._fps = fps;
    }
}
Game._useForceFrames = false;
Game._fps = 15; // default fps
Game._tick = 0;
Game._isPaused = false;
//# sourceMappingURL=game.js.map