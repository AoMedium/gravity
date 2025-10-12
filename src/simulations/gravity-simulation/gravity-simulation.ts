import Simulation from '@/features/simulation/simulation';
import SystemBuilder from './utils/system-builder';
import { systems } from './data/systems';
import Camera from './controllers/camera/camera';
import CameraController from './controllers/camera/camera-controller';
import PlayerController from './controllers/player/player-controller';
import type Entity from './models/entity/entity';
import type Settings from './models/system/settings';

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

  constructor(window: Window) {
    super(window);
  }

  public static togglePaused() {
    GravitySimulation.isPaused = !GravitySimulation.isPaused;
  }

  public init() {
    // Ensures that initialization only occurs once per instance (handles double calling from React)
    if (Simulation.isInitialized) {
      return;
    }

    Simulation.inputHandler = GravitySimulation.playerController; // TODO: consider using dependency injection instead

    const system = SystemBuilder.createSystem(
      JSON.stringify(systems),
      'Sol Alpha',
    );

    // Push items as we should only modify the original array and keep its reference
    GravitySimulation.entities.push(...system.systemObjects);

    Simulation.eventBus.publish('updateSystem', system.name);

    Simulation.isInitialized = true;
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

  private updateOutputs() {
    // Simulation.eventBus.publish(
    //   'updateEntities',
    //   GravitySimulation.entities.length,
    // );
  }
}
