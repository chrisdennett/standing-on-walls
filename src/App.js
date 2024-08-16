import React, { useState, useEffect } from "react";
import styles from "./app.module.css";
import { Controls, defaultParams } from "./components/controls/Controls";
import { DrawingCanvas } from "./components/drawingCanvas/DrawingCanvas";
import { loadImage, saveCanvas } from "./helpers/helpers";

const App = () => {
  const [params, setParams] = useState(defaultParams);
  const [canvasDimensions, setCanvasDimensions] = useState(null);
  const [maskImgObj, setMaskImgObj] = useState({ data: 0, canvas: null });
  const [pics, setPics] = useState({ bottomPic: null, topPic: null });
  const canvasRef = React.useRef(null);

  // load samples if nothing set
  useEffect(() => {
    if (!pics.bottomPic) {
      loadImage("./img/wall.jpg", (img) =>
        setPics({ ...pics, bottomPic: img })
      );
    } else if (!pics.topPic) {
      loadImage("./img/kick2.jpg", (img) => setPics({ ...pics, topPic: img }));
    } else {
      const { width: origW, height: origH } = pics.bottomPic;
      const wToHRatio = origH / origW;

      const canvas = canvasRef.current;
      canvas.width = 960;
      canvas.height = canvas.width * wToHRatio;

      setCanvasDimensions({ w: canvas.width, h: canvas.height });
    }
  }, [pics]);

  useEffect(() => {
    if (!pics || !pics.bottomPic || !pics.topPic || !canvasDimensions) return;

    const canvas = canvasRef.current;
    const { w: targW, h: targH } = canvasDimensions;

    drawCanvas({ params, canvas, targW, targH, pics, maskImgObj });
  });

  const onMaskImgObjChange = (canvas) => {
    setMaskImgObj((prev) => {
      return { canvas: canvas, data: prev.data + 1 };
    });
  };

  const onSaveImg = () => {
    saveCanvas(canvasRef.current);
  };

  const onPhotoSelected = (img) => {
    // saveCanvas(canvasRef.current);
    setPics({ ...pics, bottomPic: img });
  };

  return (
    <div className={styles.page}>
      <div>
        <Controls
          params={params}
          setParams={setParams}
          onSaveImg={onSaveImg}
          onPhotoSelected={onPhotoSelected}
        />
      </div>

      <div className={styles.canvasStack}>
        <canvas className={styles.displayCanvas} ref={canvasRef} />
        {canvasDimensions && (
          <DrawingCanvas
            className={styles.drawingCanvas}
            onUpdateCanvas={onMaskImgObjChange}
            width={canvasDimensions.w}
            height={canvasDimensions.h}
          />
        )}
      </div>
    </div>
  );
};

export default App;

const drawCanvas = ({ params, canvas, targW, targH, pics, maskImgObj }) => {
  const { width: origW, height: origH } = pics.bottomPic;

  // add a red colour behind to show up undeleted bits easily
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, targW, targH);

  // DRAW bottom pic
  if (params.showBottomPic) {
    const bottomXPos = params.bottomX * targW;
    const bottomYPos = params.bottomY * targH;

    ctx.drawImage(
      pics.bottomPic,
      0,
      0,
      origW,
      origH,
      bottomXPos,
      bottomYPos,
      targW,
      targH
    );
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
};
