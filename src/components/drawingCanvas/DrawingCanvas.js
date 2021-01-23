import React, { useEffect, useRef, useState } from "react";

export const DrawingCanvas = ({
  onUpdateCanvas,
  width = 200,
  height = 200,
  brushWidth = 50,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [point, setPoint] = useState(null);
  //   const [isSetup, setIsSetUp] = useState(false);

  const canvas = useRef(null);

  useEffect(() => {
    if (!canvas || !canvas.current) return;
    const c = canvas.current;
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
  }, [canvas, width, height]);

  const onMouseDown = (e) => {
    setIsDrawing(true);
    const newPt = getPointFromMouseEvent(e);
    setPoint(newPt);
  };

  //   const clearCanvas = () => {
  //     const c = canvas.current;
  //     c.width = width;
  //     c.height = height;
  //     const ctx = c.getContext("2d");
  //     ctx.clearRect(0, 0, c.width, c.height);
  //   };

  const onMouseMove = (e) => {
    if (!isDrawing) return;

    const newPt = { ...getPointFromMouseEvent(e), lineDrawn: true };
    const from = point ? point : newPt;
    const to = newPt;

    drawLine(from, to);
    setPoint(newPt);
  };

  const getPointFromMouseEvent = (e) => {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top; //y position within the element.

    return { x, y, lineDrawn: false };
  };

  const onMouseUp = () => {
    setPoint((prev) => {
      drawLine(prev, prev);
      return null;
    });
    setIsDrawing(false);
    onUpdateCanvas(canvas.current);
  };

  const drawLine = (from, to) => {
    if (!canvas || !canvas.current) return;
    if (!from || !to) return;

    const c = canvas.current;
    const ctx = c.getContext("2d");
    ctx.beginPath();

    ctx.strokeStyle = "0";
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushWidth;
    ctx.stroke();
  };

  //<button onClick={clearCanvas}>CLEAR</button>

  return (
    <canvas
      ref={canvas}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseUp}
      onMouseUp={onMouseUp}
    />
  );
};
