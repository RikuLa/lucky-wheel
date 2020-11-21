import { useState } from "react";

export const useIsVisible = (): [boolean, () => void] => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleVisibilityChange = () => {
    if (document["hidden"]) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange, false);

  const cleanUp = () => {
    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange,
      false
    );
  };

  return [isVisible, cleanUp];
};
