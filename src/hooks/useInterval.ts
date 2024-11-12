import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>();
  const delayInSec = delay * 1000;

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setInterval(() => {
      savedCallback.current?.();
    }, delayInSec);

    return () => {
      clearInterval(id);
    };
  }, [delayInSec]);
};

export default useInterval;
