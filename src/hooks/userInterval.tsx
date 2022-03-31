import { useEffect, useRef } from "react";

  // How to use setInterval w/ React
  // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  
function useInterval(callback: any, delay: any) {
    const savedCallback = useRef<any>();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default useInterval;