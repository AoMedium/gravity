import { Vector2, Entity, GravityObject } from "./models.js"
import { SystemBuilder } from "./utils.js"
import { Game } from "./game.js"

export const canvas = document.querySelector("canvas");
export const c = canvas.getContext('2d');

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

    let entities: Entity[] = [];
    let nextId = 0;

    let s = SystemBuilder.createSystem("Sol Alpha");

    entities.push(new GravityObject(nextId, 100, new Vector2(innerWidth/2, innerHeight/2), new Vector2(-1,0)));
    nextId++;
    entities.push(new GravityObject(nextId, 5000, new Vector2(innerWidth/3, innerHeight/3), new Vector2(0,0)));

    Game.render = () => {
        entities.forEach((entity: Entity) => {
            entity.update(entities);
        })
    }

    Game.clear = () => {
        c.clearRect(0, 0, innerWidth, innerHeight);
    }

    Game.setFPS(30);

    Game.start();
}

main();