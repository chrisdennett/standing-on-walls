import React, { useState, useEffect } from "react";
import { DrawingCanvas } from "./components/drawingCanvas/DrawingCanvas";

const App = () => {
  const [canvasDimensions, setCanvasDimensions] = useState({ w: 800, h: 100 });
  const [maskImgObj, setMaskImgObj] = useState({ data: 0, canvas: null });
  const [pics, setPics] = useState({ pic1: null, pic2: null });
  const canvasRef = React.useRef(null);

  // load samples if nothing set
  useEffect(() => {
    if (!pics.pic1) {
      loadImage("./pic-1.jpg", (img) => setPics({ ...pics, pic1: img }));
    } else if (!pics.pic2) {
      loadImage("./pic-2.jpg", (img) => setPics({ ...pics, pic2: img }));
    } else {
      const { width: origW, height: origH } = pics.pic1;
      const wToHRatio = origH / origW;

      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = canvas.width * wToHRatio;

      setCanvasDimensions({ w: canvas.width, h: canvas.height });
    }
  }, [pics]);

  useEffect(() => {
    if (!pics || !pics.pic1 || !pics.pic2) return;

    const canvas = canvasRef.current;
    const { width: origW, height: origH } = pics.pic1;
    const { w: targW, h: targH } = canvasDimensions;

    // create a canvas from masked image

    const maskedCanvas = document.createElement("canvas");
    maskedCanvas.width = targW;
    maskedCanvas.height = targH;
    const maskCtx = maskedCanvas.getContext("2d");
    maskCtx.clearRect(0, 0, targW, targH);

    if (maskImgObj.canvas) {
      maskCtx.drawImage(maskImgObj.canvas, 0, 0);
      maskCtx.globalCompositeOperation = "source-in";
      maskCtx.drawImage(pics.pic2, 0, 0, origW, origH, 0, 0, targW, targH);
    }

    const ctx = canvas.getContext("2d");
    ctx.drawImage(pics.pic1, 0, 0, origW, origH, 0, 0, targW, targH);
    ctx.drawImage(maskedCanvas, 0, 0);
  }, [maskImgObj, pics, canvasDimensions]);

  const onMaskImgObjChange = (canvas) => {
    setMaskImgObj((prev) => {
      return { canvas: canvas, data: prev.data + 1 };
    });
  };

  return (
    <div>
      {canvasDimensions && (
        <DrawingCanvas
          onUpdateCanvas={onMaskImgObjChange}
          width={canvasDimensions.w}
          height={canvasDimensions.h}
        />
      )}
      <canvas ref={canvasRef} />
    </div>
  );
};

export default App;

// const drawCanvas = (ctx, source) => {
//   ctx.drawImage(source, 0, 0);
// };

const loadImage = (src, callback) => {
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.onload = () => {
    callback(image);
  };
  image.src = src;
};
