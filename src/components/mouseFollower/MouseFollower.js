import React from "react";
import styled from "styled-components";
import { useMousePosition } from "../../hooks/useMousePosition";

export const MouseFollower = ({ size }) => {
  const pos = useMousePosition();

  if (!pos || !size) return null;

  const halfSize = size / 2;
  const style = { left: pos.x - halfSize, top: pos.y - halfSize };

  const strokeWidth = 2;

  return (
    <Follower style={style}>
      <svg width={size * 2} height={size * 2}>
        <circle
          cx={halfSize}
          cy={halfSize}
          r={halfSize - strokeWidth}
          fill={"none"}
          stroke={"#000"}
          strokeWidth={strokeWidth}
          //   vector-effect="non-scaling-stroke"
        />
        <circle
          cx={halfSize}
          cy={halfSize}
          r={halfSize - strokeWidth}
          fill={"none"}
          stroke={"#fff"}
          strokeWidth={strokeWidth}
          strokeDasharray={"10 10"}
          //   vector-effect="non-scaling-stroke"
        />
      </svg>
    </Follower>
  );
};

const Follower = styled.div`
  position: fixed;
  user-select: none;
  pointer-events: none;
  z-index: 999;
`;
