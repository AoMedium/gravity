import UpdateManager from './managers/update-manager';
import type Simulation from '../models/simulation';
import InputManager from './managers/input-manager';
import { memo } from 'react';

interface Props {
  simulation: Simulation | null;
}

const SimulationManagers = memo(function SimulationManagers(props: Props) {
  return (
    <>
      <UpdateManager simulation={props.simulation} />
      <InputManager />
    </>
  );
});

export default SimulationManagers;
