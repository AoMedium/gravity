import { useEffect, useState } from 'react';
import EventBus from '../util/event-bus';

export default function useOutputData<T>(key: string) {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    const callback = (data: unknown) => {
      setValue(data as T); // TODO: consider whether this is appropriate casting
    };

    EventBus.subscribe(key, callback);

    return () => EventBus.unsubscribe(key, callback);
  }, [key]);

  return value;
}
