import { useEffect } from "react";
import { createCanvasFromImage } from "../helpers/helpers";

export function useSampleImage(url, callback) {
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      const canvas = createCanvasFromImage(image);
      callback(canvas);
    };
    image.src = url;
  }, [url, callback]);
}
