import { Vector2, Entity, GravityObject } from "./models.js"
import { SystemBuilder } from "./utils.js"
import { Game } from "./game.js"
import { Camera, PlayerController } from "./input.js";

export const canvas = document.querySelector("canvas");
export const c = canvas.getContext('2d');




function main() {
    initCanvas();
    initGame();

    Game.start();
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

    let system = SystemBuilder.createSystem("Sol Alpha");
    console.log(system);

    let controller: PlayerController = new PlayerController(new Camera());

    Game.nextFrame = () => {
        system.systemObjects.forEach((entity: Entity) => {
            if (!Game.isPaused) {
                entity.update(system.systemObjects, controller);
            }
            
            entity.render(controller);

            controller.getActiveCamera().update();
        })
    }

    Game.clear = () => {
        c.clearRect(0, 0, innerWidth, innerHeight);
    }

    Game.setFPS(60);
    Game.start();
}

main();