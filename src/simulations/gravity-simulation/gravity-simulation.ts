import Simulation from '@/features/simulation/simulation';
import type Entity from './models/entity';
import Camera from './models/camera';
import PlayerController from './models/player-controller';
import type Settings from './models/settings';
import SystemBuilder from './utils/system-builder';
import { systems } from './data/systems';
import CameraController from './models/camera-controller';
import GravityObject from './models/gravity-object';
import type GravityObjectDTO from './models/dto/gravity-object-dto';

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

    GravitySimulation.entities.push(
      new GravityObject({
        name: 'Sol Alpha',
        mass: 59600000,
        position: {
          x: 0,
          y: 0,
        },
        attributes: {
          fixed: true,
          primaryColor: '#fff',
        },
      } as GravityObjectDTO),
      new GravityObject({
        name: 'Kas',
        mass: 55,
        position: {
          x: 500,
          y: 0,
        },
        velocity: {
          x: 0,
          y: -10,
        },
        attributes: {
          orbit: true,
          distance: 0.387,
          primaryColor: '#aaa',
        },
      } as GravityObjectDTO),
    ); //system.systemObjects;

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
