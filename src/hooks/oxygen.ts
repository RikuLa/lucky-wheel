import React from "react";
import { useIsVisible } from "./visibility";

export const useOxygen = (initial: number) => {
  const [remaining, setRemaining] = React.useState<number>(initial);
  const [visible] = useIsVisible();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (visible && remaining > 0) {
        setRemaining((remaining) => remaining - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [visible, remaining]);

  return [remaining];
};
