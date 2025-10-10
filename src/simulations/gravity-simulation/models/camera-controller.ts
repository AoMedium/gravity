import type Camera from './camera';

export default class CameraController {
  private _cameras: Camera[] = [];
  private _activeCameraIndex: number = -1;

  public getActiveCamera(): Camera | undefined {
    if (this._activeCameraIndex == -1) return undefined;

    return this._cameras[this._activeCameraIndex];
  }

  public setActiveCamera(id: number) {
    const index = this._cameras.findIndex((camera) => camera.id == id);

    if (index == -1) {
      console.error('Could not find camera with index', id);
      return;
    }
    this._activeCameraIndex = index;
  }

  public addCamera(camera: Camera) {
    if (
      this._cameras.findIndex(
        (existingCamera) => existingCamera.id == camera.id,
      ) != -1
    ) {
      console.error('Camera already added to controller.');
      return;
    }
    this._cameras.push(camera);
  }

  public increment() {
    if (this._activeCameraIndex < this._cameras.length - 1) {
      this._activeCameraIndex++;
    } else {
      this._activeCameraIndex = 0;
    }
  }

  public decrement() {
    if (this._activeCameraIndex > 0) {
      this._activeCameraIndex--;
    } else {
      this._activeCameraIndex = this._cameras.length;
    }
  }
}
