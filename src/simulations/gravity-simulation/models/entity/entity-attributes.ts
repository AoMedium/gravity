import type EntityAttributesDTO from '../dto/entity-attributes-dto';

export class EntityAttributes {
  fixed: boolean = false;
  orbit: boolean = false;
  center: string | undefined = undefined;
  distance: number = 0;
  primaryColor: string = '#fff';

  constructor(attributes: EntityAttributesDTO | undefined) {
    if (!attributes) return;

    this.fixed = attributes.fixed || false;
    this.orbit = attributes.orbit || false;
    this.center = attributes.center || undefined;
    this.distance = attributes.distance || 0;
    this.primaryColor = attributes.primaryColor || '#fff';
  }
}
