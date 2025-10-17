import type EntityAttributesDTO from './entity-attributes-dto';
import type { EntityDTO } from './entity-dto';

export default interface GravityObjectDTO extends EntityDTO {
  mass: number;
  attributes?: EntityAttributesDTO;
}
