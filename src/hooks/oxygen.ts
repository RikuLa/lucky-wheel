import React from "react";
import { useIsVisible } from "./visibility";

export const useOxygen = (initial: number) => {
  const [remaining, setRemaining] = React.useState<number>(initial);
  const [visible] = useIsVisible();

  let interval;

  React.useEffect(() => {
    interval = setInterval(() => {
      if (visible && remaining > 0) {
        console.log("remaining is:", remaining);
        setRemaining((remaining) => remaining - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [visible]);

  return [remaining];
};
