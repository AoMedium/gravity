const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');
function initCanvas() {
    // fix blurry canvas rendering
    // https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm
    let canvasScale = window.devicePixelRatio;
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
    Game.render = () => {
        c.beginPath();
        c.arc(Game.getTick(), Game.getTick(), 5, 0, 2 * Math.PI);
        c.fill();
        c.closePath;
    }

    Game.clear = () => {
        c.clearRect(0, 0, innerWidth, innerHeight);
    }
}

main();