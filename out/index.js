var canvas = document.querySelector("canvas");
var c = canvas.getContext('2d');
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
function main() {
    initCanvas();
    initGame();
    Game.start();
}
function initGame() {
    var entities = [];
    var nextId = 0;
    entities.push(new GravityObject(nextId, 100, new Vector2(innerWidth / 2, innerHeight / 2), new Vector2(-1, 0)));
    nextId++;
    entities.push(new GravityObject(nextId, 5000, new Vector2(innerWidth / 3, innerHeight / 3), new Vector2(0, 0)));
    Game.render = function () {
        entities.forEach(function (entity) {
            entity.update(entities);
            //console.log(entity.getVel());
        });
    };
    Game.clear = function () {
        c.clearRect(0, 0, innerWidth, innerHeight);
    };
    Game.setFPS(30);
    Game.start();
}
main();
//# sourceMappingURL=index.js.map