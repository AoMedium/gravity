import GravityObjectSettings from './settings/gravity-object-settings';
import ViewSettings from './settings/view-settings';

export default class Settings {
  public view: ViewSettings = new ViewSettings();
  public gravityObject: GravityObjectSettings = new GravityObjectSettings();
}
