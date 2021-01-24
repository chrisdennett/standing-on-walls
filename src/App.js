import React, { useState, useEffect } from "react";
import { Controls, defaultParams } from "./components/controls/Controls";
import { DrawingCanvas } from "./components/drawingCanvas/DrawingCanvas";
import { loadImage } from "./helpers/helpers";

const App = () => {
  const [params, setParams] = useState(defaultParams);
  const [canvasDimensions, setCanvasDimensions] = useState({ w: 800, h: 100 });
  const [maskImgObj, setMaskImgObj] = useState({ data: 0, canvas: null });
  const [pics, setPics] = useState({ bottomPic: null, topPic: null });
  const canvasRef = React.useRef(null);

  // load samples if nothing set
  useEffect(() => {
    if (!pics.bottomPic) {
      loadImage("./pic-1.jpg", (img) => setPics({ ...pics, bottomPic: img }));
    } else if (!pics.topPic) {
      loadImage("./pic-2.jpg", (img) => setPics({ ...pics, topPic: img }));
    } else {
      const { width: origW, height: origH } = pics.bottomPic;
      const wToHRatio = origH / origW;

      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = canvas.width * wToHRatio;

      setCanvasDimensions({ w: canvas.width, h: canvas.height });
    }
  }, [pics]);

  useEffect(() => {
    if (!pics || !pics.bottomPic || !pics.topPic) return;

    const canvas = canvasRef.current;
    const { width: origW, height: origH } = pics.bottomPic;
    const { w: targW, h: targH } = canvasDimensions;

    // add a red colour behind to show up undeleted bits easily
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, targW, targH);

    // DRAW bottom pic
    if (params.showBottomPic) {
      ctx.drawImage(pics.bottomPic, 0, 0, origW, origH, 0, 0, targW, targH);
    }

    // CREATE MASKED TOP CANVAS
    const maskedCanvas = document.createElement("canvas");
    maskedCanvas.width = targW;
    maskedCanvas.height = targH;
    const maskCtx = maskedCanvas.getContext("2d");
    maskCtx.clearRect(0, 0, targW, targH);

    if (maskImgObj.canvas) {
      maskCtx.drawImage(maskImgObj.canvas, 0, 0);
      maskCtx.globalCompositeOperation = "source-out";
      maskCtx.drawImage(pics.topPic, 0, 0, origW, origH, 0, 0, targW, targH);
    }

    if (params.showTopPic) {
      ctx.globalAlpha = params.topOpacity;
      ctx.drawImage(maskedCanvas, 0, 0);
      ctx.globalAlpha = 1;
    }
  }, [maskImgObj, pics, canvasDimensions, params]);

  const onMaskImgObjChange = (canvas) => {
    setMaskImgObj((prev) => {
      return { canvas: canvas, data: prev.data + 1 };
    });
  };

  return (
    <div>
      <div>
        <Controls params={params} setParams={setParams} />
      </div>
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
