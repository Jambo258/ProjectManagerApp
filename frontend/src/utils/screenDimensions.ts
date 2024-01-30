import React from "react";
import { useState } from "react";

const useScreenDimensions = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const updateDimensions = () => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  React.useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return screenSize;
};

export default useScreenDimensions;
