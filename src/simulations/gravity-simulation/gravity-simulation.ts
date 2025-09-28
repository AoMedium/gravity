import Simulation from '@/features/simulation/models/simulation';
import type Entity from './models/entity';
import { GravityObject } from './models/gravity-object';
import Vector2 from './models/vector2';
import { Camera } from './models/camera';
import { PlayerController } from './models/player-controller';
import type Settings from './models/settings';

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

    GravitySimulation.entities = [
      new GravityObject({
        name: 'Test 1',
        position: Vector2.zero(),
        mass: 10000,
        attributes: { primaryColor: '#fd2' },
      }),
      new GravityObject({
        name: 'Test 2',
        position: new Vector2(50, 50),
        velocity: new Vector2(0.5, -0.5),
        mass: 50,
        attributes: { primaryColor: '#fff' },
      }),
      new GravityObject({
        name: 'Test 3',
        position: new Vector2(-100, -100),
        velocity: new Vector2(-0.5, 0.5),
        mass: 20,
        attributes: { primaryColor: '#55f' },
      }),
      new GravityObject({
        name: 'Test 4',
        position: new Vector2(100, -100),
        velocity: new Vector2(0.5, 0.5),
        mass: 300,
        attributes: { primaryColor: 'rgba(111, 235, 228, 1)' },
      }),
    ];
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
