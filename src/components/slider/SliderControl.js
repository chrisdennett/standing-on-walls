import React from "react";
import styles from "./slider.module.css";
import { ImArrowDown2, ImArrowUp2 } from "react-icons/im";
import ReactSlider from "react-slider";

export const SliderControl = ({ value, onChange }) => {
  const min = 0;
  const max = 1;
  const step = 0.1;

  const onIncrease = () => onChange(value + step);
  const onDecrease = () => onChange(value - step);

  return (
    <div className={styles.sliderControl}>
      <h3 className={styles.label}>
        BRUSH SIZE: <span>(use keyboard up/down arrow keys)</span>
      </h3>
      <div className={styles.sliderUi}>
        <button className={styles.fineControlButt} onClick={onDecrease}>
          <ImArrowDown2 />
        </button>

        <ReactSlider
          className={styles.slider}
          value={value}
          onChange={onChange}
          renderTrack={Track}
          renderThumb={Thumb}
          step={step}
          min={min}
          max={max}
        />

        <button className={styles.fineControlButt} onClick={onIncrease}>
          <ImArrowUp2 />
        </button>
      </div>
    </div>
  );
};

// THUMB
const Thumb = (props, state) => (
  <div {...props} className={styles.thumb}>
    {state.valueNow}
  </div>
);

// TRACK
const Track = (props, state) => {
  const classes = `${styles.track} ${
    state.index === 1 ? styles.trackAfterThumb : ""
  }`;

  return <div {...props} className={classes} />;
};
