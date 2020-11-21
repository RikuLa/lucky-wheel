import { useState, useEffect } from "react";

export const useIsVisible = (): [boolean] => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleVisibilityChange = () => {
    if (document["hidden"]) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    handleVisibilityChange();
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
      false
    );
    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
        false
      );
    };
  }, []);

  return [isVisible];
};
