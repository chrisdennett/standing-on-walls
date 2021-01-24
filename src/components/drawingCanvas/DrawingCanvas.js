import React, { useEffect, useRef, useState } from "react";

export const DrawingCanvas = ({
  className,
  onUpdateCanvas,
  width = 200,
  height = 200,
  brushWidth = 50,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const canvas = useRef(null);

  useEffect(() => {
    if (!canvas || !canvas.current) return;
    const c = canvas.current;
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    onUpdateCanvas(c);
    // eslint-disable-next-line
  }, [canvas, width, height]);

  const onMouseDown = (e) => {
    setIsDrawing(true);
    const newPt = getPointFromMouseEvent(e);
    drawPoint(newPt);
  };

  const clearCanvas = () => {
    const c = canvas.current;
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    onUpdateCanvas(c);
  };

  const onMouseMove = (e) => {
    if (!isDrawing) return;

    const newPt = getPointFromMouseEvent(e);
    drawPoint(newPt);
  };

  const drawPoint = (pt) => {
    const c = canvas.current;
    const ctx = c.getContext("2d");

    const outerRadius = brushWidth / 2;
    const innerRadius = outerRadius / 4;

    var gradient = ctx.createRadialGradient(
      pt.x,
      pt.y,
      innerRadius,
      pt.x,
      pt.y,
      outerRadius
    );
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.4, "rgba(0,0,0,0.5)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, brushWidth / 2, 0, 2 * Math.PI);

    ctx.fillStyle = gradient;
    ctx.fill();
  };

  const getPointFromMouseEvent = (e) => {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top; //y position within the element.

    return { x, y, lineDrawn: false };
  };

  const onMouseUp = () => {
    setIsDrawing(false);
    onUpdateCanvas(canvas.current);
  };

  return (
    <>
      <div>
        <canvas
          ref={canvas}
          className={className}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseOut={onMouseUp}
          onMouseUp={onMouseUp}
        />
      </div>
      <button onClick={clearCanvas}>CLEAR</button>
    </>
  );
};
