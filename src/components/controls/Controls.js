import React from "react";
import PhotoSelector from "../photoSelector/PhotoSelector";
import { SliderControl } from "../slider/SliderControl";

export const Controls = ({ params, setParams, onSaveImg, onPhotoSelected }) => {
  return (
    <div>
      <h1>Controls</h1>
      <PhotoSelector onPhotoSelected={onPhotoSelected} />
      <button onClick={onSaveImg}>SAVE IMAGE</button>
      <SliderControl
        label={"Top Pic Transparency"}
        value={params.topOpacity}
        onChange={(newValue) => setParams({ ...params, topOpacity: newValue })}
      />
      <SliderControl
        label={"Bottom Pic Horizontal Pos"}
        value={params.bottomX}
        min={-0.8}
        max={0.8}
        onChange={(newValue) => setParams({ ...params, bottomX: newValue })}
      />
      <SliderControl
        label={"Bottom Pic Vertical Pos"}
        value={params.bottomY}
        min={-0.8}
        max={0.8}
        onChange={(newValue) => setParams({ ...params, bottomY: newValue })}
      />
      <label>
        SHOW TOP PIC:{" "}
        <input
          name="showTopPic"
          type="checkbox"
          checked={params.showTopPic}
          onChange={() =>
            setParams({ ...params, showTopPic: !params.showTopPic })
          }
        />
      </label>
      <label>
        SHOW BOTTOM PIC:{" "}
        <input
          name="showBottomPic"
          type="checkbox"
          checked={params.showBottomPic}
          onChange={() =>
            setParams({ ...params, showBottomPic: !params.showBottomPic })
          }
        />
      </label>
    </div>
  );
};

export const defaultParams = {
  showTopPic: true,
  showBottomPic: true,
  topOpacity: 1,
  bottomX: 0,
  bottomY: 0,
  bottomSizeFraction: 1,
};
