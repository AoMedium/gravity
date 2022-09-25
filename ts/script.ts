const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');



class Game {
    private static useForceFrames: boolean = true;
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

}

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

function main() {

    initCanvas();
    initGame();

    Game.start();
}

main();