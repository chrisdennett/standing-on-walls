import { useEffect } from "react";
export const useKeyPress = (key, action) => {
  useEffect(
    () => {
      function onKeyDown(e) {
        // console.log("e.key: ", e.key);
        if (e.key === key) action();
      }
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    },
    // eslint-disable-next-line
    []
  );
};
