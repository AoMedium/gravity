import type { RootState } from '@/state/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type Simulation from '../../models/simulation';

interface Props {
  simulation: Simulation | null;
}

export default function UpdateManager(props: Props) {
  const step = useSelector((state: RootState) => state.simulation.step);

  useEffect(() => {
    if (props.simulation) {
      props.simulation.update();
    }
  }, [props.simulation, step]);

  return <></>;
}
