import type GravityObjectDTO from './gravity-object-dto';

export default interface SystemDTO {
  name: string;
  center: string;
  AU: number;
  systemObjects: GravityObjectDTO[];
}
