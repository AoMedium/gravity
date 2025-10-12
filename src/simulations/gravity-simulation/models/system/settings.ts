export default class Settings {
  public showTrails: boolean = false;
  public showTrailNodes: boolean = false;
  public collisionMode: CollisionMode = 'absorb';
}

export type CollisionMode = 'absorb' | 'distributive';
