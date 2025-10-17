import type Action from '@/simulations/gravity-simulation/utils/action';

export default interface InputHandler {
  keydown(key: string): void;
  keyup(key: string): void;
  trigger(action: Action): void;
  mousedown(event: MouseEvent): void;
}
