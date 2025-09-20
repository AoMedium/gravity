export default class Simulation {
  x: number;
  y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }

  public step() {
    this.x++;
    this.y++;
  }
}
