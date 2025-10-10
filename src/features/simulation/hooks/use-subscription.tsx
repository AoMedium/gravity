import { useEffect, useState } from 'react';
import Simulation from '../simulation';

export default function useSubscription<T>(key: string) {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    const callback = (data: unknown) => {
      setValue(data as T); // TODO: consider requiring callback to have parameter of T instead of casting here
    };

    Simulation.eventBus.subscribe(key, callback);

    return () => Simulation.eventBus.unsubscribe(key, callback);
  }, [key]);

  return value;
}
