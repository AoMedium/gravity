import Action from '../../../utils/action';

export default class CameraActions {
  public static moveUp: Action = new Action('Move Up');
  public static moveDown: Action = new Action('Move Down');
  public static moveLeft: Action = new Action('Move Left');
  public static moveRight: Action = new Action('Move Right');

  public static zoomIn: Action = new Action('Zoom In');
  public static zoomOut: Action = new Action('Zoom Out');

  public static previousCamera: Action = new Action('Previous Camera');
  public static nextCamera: Action = new Action('Next Camera');

  public static previousTarget: Action = new Action('Previous Target');
  public static nextTarget: Action = new Action('Next Target');

  public static toggleSmoothMovement: Action = new Action(
    'Toggle Smooth Movement',
  );
  public static toggleTargeting: Action = new Action('Toggle Targeting');

  public static toggleCursor: Action = new Action('Toggle Cursor');
  public static toggleTargetCursor: Action = new Action('Toggle Target Cursor');
}
