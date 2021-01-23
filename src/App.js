import React, { useState, useEffect } from "react";

const App = () => {
  const [pics, setPics] = useState({ pic1: null, pic2: null });
  const canvasRef = React.useRef(null);

  useEffect(() => {
    if (!pics.pic1) {
      loadImage("pic-1.jpg", (img) => setPics({ ...pics, pic1: img }));
    } else if (!pics.pic2) {
      loadImage("pic-2.jpg", (img) => setPics({ ...pics, pic2: img }));
    } else {
      const canvas = canvasRef.current;

      canvas.width = pics.pic1.width;
      canvas.height = pics.pic1.height;

      const ctx = canvas.getContext("2d");
      drawCanvas(ctx, pics.pic1);
    }
  }, [pics]);

  return <canvas ref={canvasRef} />;
};

export default App;

const drawCanvas = (ctx, source) => {
  ctx.drawImage(source, 0, 0);
};

const loadImage = (src, callback) => {
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.onload = () => {
    callback(image);
  };
  image.src = src;
};
