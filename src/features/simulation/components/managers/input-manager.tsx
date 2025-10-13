import { start, stop } from '@/state/simulation/simulation-slice';
import { useDispatch } from 'react-redux';
import useEventListener from '../../hooks/use-event-listener';
import Simulation from '../../simulation';

export default function InputManager() {
  const dispatch = useDispatch();

  useEventListener('keydown', (event: KeyboardEvent) => {
    event.preventDefault();
    Simulation.inputHandler.keydown(event.key);
  });

  useEventListener('keyup', (event: KeyboardEvent) => {
    event.preventDefault();
    Simulation.inputHandler.keyup(event.key);
  });

  return (
    <>
      <button onClick={() => dispatch(start())}>Start</button>
      <button onClick={() => dispatch(stop())}>Stop</button>

      {/* Changing controls will rerender the component */}
      {Simulation.controls.map((control, index) => (
        <button
          key={index}
          onClick={() => {
            Simulation.inputHandler.trigger(control);
          }}
        >
          {control.functionality}
        </button>
      ))}
    </>
  );
}
