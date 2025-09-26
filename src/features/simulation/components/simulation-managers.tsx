import UpdateManager from './managers/update-manager';
import type Simulation from '../models/simulation';
import InputManager from './managers/input-manager';

interface Props {
  simulation: Simulation | null;
}

export default function SimulationManagers(props: Props) {
  return (
    <>
      <UpdateManager simulation={props.simulation} />
      <InputManager />
    </>
  );
}
