import { increment, start, stop } from '@/state/simulation/simulation-slice';
import { useDispatch } from 'react-redux';
import useEventListener from '../../hooks/use-event-listener';

export default function InputManager() {
  const dispatch = useDispatch();

  useEventListener('keypress', (event: KeyboardEvent) => {
    if (event.key === 's') {
      dispatch(increment());
    }
  });

  return (
    <>
      <button onClick={() => dispatch(start())}>Start</button>
      <button onClick={() => dispatch(stop())}>Stop</button>
    </>
  );
}
