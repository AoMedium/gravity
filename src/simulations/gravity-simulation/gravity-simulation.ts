import Simulation from '@/features/simulation/simulation';
import type Entity from './models/entity';
import Camera from './models/camera';
import PlayerController from './models/player-controller';
import type Settings from './models/settings';
import SystemBuilder from './utils/system-builder';
import { systems } from './data/systems';
import CameraController from './models/camera-controller';

export default class GravitySimulation extends Simulation {
  public static entities: Entity[] = [];

  public static cameraController: CameraController = new CameraController(
    new Camera(),
  );
  public static playerController: PlayerController = new PlayerController(
    GravitySimulation.cameraController,
  );

  public static settings: Settings = {
    showTrailNodes: false,
  };

  private static isPaused: boolean = false;

  constructor(window: Window) {
    super(window);
  }

  public static togglePaused() {
    GravitySimulation.isPaused = !GravitySimulation.isPaused;
  }

  public init() {
    // TODO: need to make sure these functions can handle double calling from React

    const system = SystemBuilder.createSystem(
      JSON.stringify(systems),
      'Sol Alpha',
    );

    GravitySimulation.entities = system.systemObjects;

    Simulation.eventBus.publish('updateSystem', system.name);
  }

  public update() {
    if (!GravitySimulation.isPaused) {
      this.physicsUpdate();
    }

    const camera = GravitySimulation.cameraController.getActiveItem();
    if (camera) {
      camera.update();
    }

    GravitySimulation.playerController.handleContinuousInput();
    this.updateOutputs();
  }

  private physicsUpdate() {
    for (let i = 0; i < GravitySimulation.entities.length; i++) {
      GravitySimulation.entities[i].update();
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

  public keydown(key: string) {
    GravitySimulation.playerController.keydown(key);
  }
  public keyup(key: string) {
    GravitySimulation.playerController.keyup(key);
  }

  private updateOutputs() {
    // Simulation.eventBus.publish(
    //   'updateEntities',
    //   GravitySimulation.entities.length,
    // );
  }
}
