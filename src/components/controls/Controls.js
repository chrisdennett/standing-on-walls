import React from "react";
import { SliderControl } from "../slider/SliderControl";

export const Controls = ({ params, setParams }) => {
  return (
    <div>
      <h1>Controls</h1>
      <SliderControl
        value={params.topOpacity}
        onChange={(newValue) => setParams({ ...params, topOpacity: newValue })}
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
  topX: 0,
  topY: 0,
  topSizeFraction: 1,
  topOpacity: 0,
};
