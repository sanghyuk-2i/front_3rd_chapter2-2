import { worker } from './browser';

export const enableMocking = async () => {
  if (process.env.NODE_ENV !== 'development' || typeof window === undefined) {
    return;
  }

  return worker.start();
};
