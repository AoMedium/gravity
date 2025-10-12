import type EntityAttributesDTO from '../dto/entity-attributes-dto';

export class EntityAttributes {
  fixed: boolean = false;
  orbit: boolean = false;
  center: string | undefined = undefined;
  distance: number = 0;
  primaryColor: string = '#fff';

  constructor(attributes: EntityAttributesDTO) {
    this.fixed = (attributes && attributes.fixed) || false;
    this.orbit = (attributes && attributes.orbit) || false;
    this.center = (attributes && attributes.center) || undefined;
    this.distance = (attributes && attributes.distance) || 0;
    this.primaryColor = (attributes && attributes.primaryColor) || '#fff';
  }
}
