import Simulation from '@/features/simulation/simulation';
import SystemBuilder from './utils/system-builder';
import { systems } from './data/systems';
import Camera from './controllers/camera/camera';
import CameraController from './controllers/camera/camera-controller';
import PlayerController from './controllers/player/player-controller';
import EffectsController from './controllers/effects/effects-controller';
import Canvas from './utils/canvas';
import EntityController from './controllers/entity-controller/entity-controller';
import SimulationActions from './system/actions/simulation-actions';
import CameraActions from './system/actions/camera-actions';
import Settings from './system/settings';

// TODO: change static to getters when migrated to singleton
export default class GravitySimulation extends Simulation {
  public static entityController: EntityController = new EntityController();
  public static effectsController: EffectsController = new EffectsController();
  public static cameraController: CameraController = new CameraController(
    new Camera(),
  );
  public static playerController: PlayerController = new PlayerController(
    GravitySimulation.cameraController,
    GravitySimulation.entityController.entities.getRef(),
  );

  public static settings: Settings = new Settings();

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
      // 'Empty System',
      // 'Basic System',
      'Sol Alpha',
    );

    // Push items as we should only modify the original array and keep its reference
    GravitySimulation.entityController.entities
      .getRef()
      .push(...system.systemObjects);

    Simulation.eventBus.publish('updateSystem', system.name);

    Simulation.setActions(
      SimulationActions.togglePause,
      SimulationActions.toggleTrails,
      CameraActions.toggleCursor,
      CameraActions.toggleTargetCursor,
    );

    Simulation.isInitialized = true;
    Simulation.eventBus.publish('initSimulation', Date.now());
  }

  public update() {
    if (!GravitySimulation.isPaused) {
      this.physicsUpdate();
    }

    GravitySimulation.cameraController.update();
    GravitySimulation.playerController.handleContinuousInput();

    this.updateOutputs();
  }

  private physicsUpdate() {
    GravitySimulation.entityController.update();
    GravitySimulation.effectsController.update();
  }

  public draw() {
    if (Simulation.context) Canvas.clear(Simulation.context);

    GravitySimulation.entityController.draw();
    GravitySimulation.effectsController.draw();
    GravitySimulation.cameraController.draw();
  }

  private updateOutputs() {
    // Simulation.eventBus.publish(
    //   'updateEntities',
    //   GravitySimulation.entities.length,
    // );
  }
}
