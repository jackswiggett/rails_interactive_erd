import { useEffect, useRef } from 'react';

/** Hook that returns the value that the input had on the previous render */
export const usePrevious = <T>(value: T) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  // this returns *before* the effect above is executed
  return ref.current;
};
