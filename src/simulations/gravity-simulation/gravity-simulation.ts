import Simulation from '@/features/simulation/simulation';
import type Entity from './models/entity';
import Camera from './models/camera';
import PlayerController from './models/player-controller';
import type Settings from './models/settings';
import SystemBuilder from './utils/system-builder';
import { systems } from './data/systems';
import CameraController from './models/camera-controller';

// TODO: change static to getters when migrated to singleton
export default class GravitySimulation extends Simulation {
  public static entities: Entity[] = [];

  public static cameraController: CameraController = new CameraController(
    new Camera(),
  );
  public static playerController: PlayerController = new PlayerController(
    GravitySimulation.cameraController,
    GravitySimulation.entities,
  );

  public static settings: Settings = {
    showTrailNodes: false,
  };

  private static isPaused: boolean = false;
  private static isInitialized: boolean = false;

  constructor(window: Window) {
    super(window);
  }

  public static togglePaused() {
    GravitySimulation.isPaused = !GravitySimulation.isPaused;
  }

  public init() {
    // Ensures that initialization only occurs once per instance (handles double calling from React)
    if (GravitySimulation.isInitialized) {
      return;
    }

    const system = SystemBuilder.createSystem(
      JSON.stringify(systems),
      'Sol Alpha',
    );

    // Push items as we should only modify the original array and keep its reference
    GravitySimulation.entities.push(...system.systemObjects);

    Simulation.eventBus.publish('updateSystem', system.name);

    GravitySimulation.isInitialized = true;
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
