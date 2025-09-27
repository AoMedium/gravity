import { store } from '@/state/store';
import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

export default function AppProviders({ children }: PropsWithChildren) {
  return <Provider store={store}>{children}</Provider>;
}
