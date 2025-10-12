export default interface InputHandler {
  keydown(key: string): void;
  keyup(key: string): void;
  mousedown(event: MouseEvent): void;
}
