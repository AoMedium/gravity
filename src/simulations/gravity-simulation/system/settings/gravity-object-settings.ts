export default class GravityObjectSettings {
  public collisionMode: CollisionMode = 'absorb';
  public labelMode: LabelMode = 'complete';
  public showTrails: boolean = false;
  public showTrailNodes: boolean = false;
}

export type LabelMode = 'minimal' | 'basic' | 'complete';
export type CollisionMode = 'absorb' | 'distributive';
