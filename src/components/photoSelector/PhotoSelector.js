import React from "react";
import styled from "styled-components";

const maxOutputCanvasSize = 1000;

const PhotoSelector = ({ onPhotoSelected, children }) => {
  const onFileSelect = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      const selected = e.target.files;

      createCanvasFromFile(selected[0], (img) => {
        onPhotoSelected(img);
      });
    }
  };

  // this ensures onChange still fires if same file selected
  const onInputClick = (e) => {
    e.target.value = "";
  };

  return (
    <Holder>
      <input
        onClick={onInputClick}
        onChange={onFileSelect}
        multiple={false}
        capture="environment"
        type="file"
        accept="image/*;capture=camera"
        name={"photo-selector"}
        id={"photo-selector"}
      />

      <label htmlFor={"photo-selector"}>
        {children ? children : <AddPhotoBetter>add photo</AddPhotoBetter>}
      </label>
    </Holder>
  );
};

export default PhotoSelector;

const AddPhotoBetter = styled.button`
  text-transform: uppercase;
  margin-right: 20px;
  padding: 20px 10px;
  background: #3977b7;
  border: 1px solid rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
`;

const Holder = styled.div`
  display: inline-block;
  position: relative;

  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  label {
    padding: 10px 0;
    cursor: pointer;
  }

  button {
    pointer-events: none;
  }
`;

const createCanvasFromFile = (file, callback) => {
  GetImage(file, (sourceImg, imgOrientation) => {
    const maxWidthCanvas = createMaxSizeCanvas(
      sourceImg,
      maxOutputCanvasSize,
      800
    );
    const canvas = createOrientatedCanvas(maxWidthCanvas, imgOrientation);

    callback(canvas);
  });
};

export function createMaxSizeCanvas(
  inputCanvas,
  _maxWidth = 1000,
  _maxHeight = 1000
) {
  const { width: inputWidth, height: inputHeight } = inputCanvas;
  const maxWidth = _maxWidth ? _maxWidth : inputWidth;
  const maxHeight = _maxHeight ? _maxHeight : inputHeight;

  // get width and height restricted to maximums
  const { width: outputWidth, height: outputHeight } = getDimensionsToFit(
    inputWidth,
    inputHeight,
    maxWidth,
    maxHeight
  );

  // set up the output canvas
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;

  // draw input to output at the restricted size
  const ctx = outputCanvas.getContext("2d");
  ctx.drawImage(
    inputCanvas,
    0,
    0,
    inputWidth,
    inputHeight,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return outputCanvas;
}

// Reads file as Array buffer to get camera orientation from exif data
function GetPhotoOrientation(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const view = new DataView(e.target.result);

    if (view.getUint16(0, false) !== 0xffd8) return callback(-2);
    const length = view.byteLength;
    let offset = 2;
    while (offset < length) {
      let marker = view.getUint16(offset, false);
      offset += 2;
      if (marker === 0xffe1) {
        offset += 2;
        if (view.getUint32(offset, false) !== 0x45786966) return callback(-1);

        const little = view.getUint16((offset += 6), false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        const tags = view.getUint16(offset, little);
        offset += 2;
        for (let i = 0; i < tags; i++)
          if (view.getUint16(offset + i * 12, little) === 0x0112)
            return callback(view.getUint16(offset + i * 12 + 8, little));
      } else if ((marker & 0xff00) !== 0xff00) break;
      else offset += view.getUint16(offset, false);
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file);
}

export const getDimensionsToFit = (
  inputWidth,
  inputHeight,
  maxWidth,
  maxHeight
) => {
  let outputWidth, outputHeight;
  const { widthToHeightRatio, heightToWidthRatio } = getDimensionRatios(
    inputWidth,
    inputHeight
  );

  // if the width need reducing, set width to max and scale height accordingly
  if (inputWidth > maxWidth) {
    outputWidth = maxWidth;
    outputHeight = outputWidth * widthToHeightRatio;

    if (outputHeight > maxHeight) {
      outputHeight = maxHeight;
      outputWidth = outputHeight * heightToWidthRatio;
    }
  }
  // if the height need reducing, set height to max and scale width accordingly
  else if (inputHeight > maxHeight) {
    outputHeight = maxHeight;
    outputWidth = outputHeight * heightToWidthRatio;
  }
  // otherwise output can match input
  else {
    outputWidth = inputWidth;
    outputHeight = inputHeight;
  }

  return { width: outputWidth, height: outputHeight };
};

export function getDimensionRatios(w, h) {
  const widthToHeightRatio = Math.round(100 * (h / w)) / 100;
  const heightToWidthRatio = Math.round(100 * (w / h)) / 100;

  return { widthToHeightRatio, heightToWidthRatio };
}

export function GetImage(imgFile, callback) {
  GetPhotoOrientation(imgFile, (orientation) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target.result;
      // Create a new image element
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous"); //
      img.src = imgSrc;

      // wait for it to be loaded and then return
      img.onload = (e) => {
        const w = img.width;
        const h = img.height;

        const widthToHeightRatio = h / w;
        const heightToWidthRatio = w / h;

        callback(img, orientation, widthToHeightRatio, heightToWidthRatio);
      };
    };
    reader.readAsDataURL(imgFile);
  });
}

export const createOrientatedCanvas = (sourceCanvas, orientation) => {
  const outputCanvas = document.createElement("canvas");
  const isPortrait = orientation > 4 && orientation < 9;

  // switch height and width if it's portrait
  let canvasW = isPortrait ? sourceCanvas.height : sourceCanvas.width;
  let canvasH = isPortrait ? sourceCanvas.width : sourceCanvas.height;

  const ctx = outputCanvas.getContext("2d");

  outputCanvas.width = canvasW;
  outputCanvas.height = canvasH;

  // transform context before drawing image
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, canvasW, 0);
      break;

    case 3:
      ctx.transform(-1, 0, 0, -1, canvasW, canvasH);
      break;

    case 4:
      ctx.transform(1, 0, 0, -1, 0, canvasH);
      break;

    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, canvasW, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, canvasW, canvasH);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, canvasH);
      break;
    default:
      break;
  }

  ctx.drawImage(sourceCanvas, 0, 0);

  return outputCanvas;
};
