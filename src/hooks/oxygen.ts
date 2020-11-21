import React from "react";
import { useIsVisible } from "./visibility";

export const useOxygen = (initial: number) => {
  const [remaining, setRemaining] = React.useState<number>(initial);
  const [visible] = useIsVisible();

  let interval;

  React.useEffect(() => {
    if (!interval) {
      interval = setInterval(() => {
        if (visible) {
          setRemaining((remaining) => remaining - 1);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [visible]);

  return [remaining];
};
