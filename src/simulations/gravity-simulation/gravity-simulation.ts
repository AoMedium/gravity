import Simulation from '@/features/simulation/models/simulation';
import type Entity from './models/entity';
import { GravityObject } from './models/gravity-object';
import Vector2 from './models/vector2';
import { Camera } from './models/camera';
import { PlayerController } from './models/player-controller';

export default class GravitySimulation extends Simulation {
  public static entities: Entity[] = [];
  public static controller: PlayerController;

  constructor(window: Window) {
    super(window);
  }

  public init() {
    GravitySimulation.controller = new PlayerController(new Camera());

    GravitySimulation.entities.push(
      new GravityObject({
        name: 'Test 1',
        position: Vector2.zero(),
        mass: 10,
        attributes: { primaryColor: '#ddd' },
      }),
      new GravityObject({
        name: 'Test 2',
        position: new Vector2(20, 20),
        mass: 1,
        attributes: { primaryColor: '#555' },
      }),
    );
  }

  public update() {
    for (let i = 0; i < GravitySimulation.entities.length; i++) {
      GravitySimulation.entities[i].update();
    }
  }

  public draw(context: CanvasRenderingContext2D) {
    if (!context) return;
    context.clearRect(0, 0, this.window.innerWidth, this.window.innerHeight);

    for (let i = 0; i < GravitySimulation.entities.length; i++) {
      GravitySimulation.entities[i].draw(context);
    }
  }
}
