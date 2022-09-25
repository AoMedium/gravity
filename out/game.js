var Game = /** @class */ (function () {
    function Game() {
    }
    Game.start = function () {
        if (this.useForceFrames) {
            this.frameIntervalId = setInterval(Game.update, 1000 / this.fps);
        }
        else {
            window.requestAnimationFrame(Game.update);
        }
    };
    Game.stop = function () {
        clearInterval(this.frameIntervalId);
    };
    Game.update = function () {
        Game.clear();
        Game.render();
        Game.tick++;
    };
    Game.render = function () { };
    Game.clear = function () { };
    Game.getTick = function () {
        return this.tick;
    };
    Game.setFPS = function (fps) {
        Game.useForceFrames = true;
        Game.fps = fps;
    };
    Game.useForceFrames = false;
    Game.fps = 15; // default fps
    Game.tick = 0;
    return Game;
}());
//# sourceMappingURL=game.js.map