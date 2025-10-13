import type Control from './control';

export default interface InputHandler {
  keydown(key: string): void;
  keyup(key: string): void;
  trigger(control: Control): void;
  mousedown(event: MouseEvent): void;
}
