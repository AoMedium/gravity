import { start, stop } from '@/state/simulation/simulation-slice';
import { useDispatch } from 'react-redux';
import useEventListener from '../../hooks/use-event-listener';
import type Simulation from '../../simulation';

interface Props {
  simulation: Simulation | null;
}

export default function InputManager(props: Props) {
  const dispatch = useDispatch();

  useEventListener('keydown', (event: KeyboardEvent) => {
    event.preventDefault();
    props.simulation?.keydown(event.key);
  });

  useEventListener('keyup', (event: KeyboardEvent) => {
    event.preventDefault();
    props.simulation?.keyup(event.key);
  });

  return (
    <>
      <button onClick={() => dispatch(start())}>Start</button>
      <button onClick={() => dispatch(stop())}>Stop</button>
    </>
  );
}
