import Simulation from '@/features/simulation/models/simulation';
import type Entity from './models/entity';
import Camera from './models/camera';
import PlayerController from './models/player-controller';
import type Settings from './models/settings';
import SystemBuilder from './utils/system-builder';
import { systems } from './data/systems';

export default class GravitySimulation extends Simulation {
  public static entities: Entity[] = [];
  public static controller: PlayerController;
  public static settings: Settings;

  constructor(window: Window) {
    super(window);
  }

  public init() {
    // TODO: need to make sure these functions can handle double calling from React
    GravitySimulation.controller = new PlayerController(new Camera());

    GravitySimulation.settings = {
      showTrailNodes: false,
    };

    const basicSystem = SystemBuilder.createSystem(
      JSON.stringify(systems),
      'Sol Alpha',
    );

    GravitySimulation.entities = basicSystem.systemObjects;
  }

  public update() {
    for (let i = 0; i < GravitySimulation.entities.length; i++) {
      GravitySimulation.entities[i].update();
    }

    const camera = GravitySimulation.controller.getActiveCamera();
    if (camera) {
      camera.update();
    }
  }

  public draw() {
    if (!Simulation.context) return;
    Simulation.context.clearRect(
      0,
      0,
      this.window.innerWidth,
      this.window.innerHeight,
    );

    for (let i = 0; i < GravitySimulation.entities.length; i++) {
      GravitySimulation.entities[i].draw();
    }
  }

  public handleInput(key: string) {
    GravitySimulation.controller.handleInput(key);
  }
}
