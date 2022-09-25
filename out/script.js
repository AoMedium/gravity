var canvas = document.querySelector("canvas");
var c = canvas.getContext('2d');
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
    Game.useForceFrames = true;
    Game.fps = 15; // default fps
    Game.tick = 0;
    return Game;
}());
function initCanvas() {
    // fix blurry canvas rendering
    // https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm
    var canvasScale = window.devicePixelRatio;
    canvas.width = window.innerWidth * canvasScale;
    canvas.height = window.innerHeight * canvasScale;
    // ensure all drawing operations are scaled
    c.scale(devicePixelRatio, devicePixelRatio);
    // scale back down to window dimensions
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
}
function initGame() {
    Game.render = function () {
        c.beginPath();
        c.arc(Game.getTick(), Game.getTick(), 5, 0, 2 * Math.PI);
        c.fill();
        c.closePath;
    };
    Game.clear = function () {
        c.clearRect(0, 0, innerWidth, innerHeight);
    };
}
function main() {
    initCanvas();
    initGame();
    Game.start();
}
main();
//# sourceMappingURL=script.js.map