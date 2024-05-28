import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { COLORS } from '../../../utils/Contants';

const COLOR_LEGEND_MARGIN = { top: 0, right: 0, bottom: 50, left: 0 };

export const ColorLegend = ({
  height,
  colorScale,
  width,
  interactionData,
  max,
  min
}) => {
  const canvasRef = useRef(null);

  const boundsWidth =
    width - COLOR_LEGEND_MARGIN.right - COLOR_LEGEND_MARGIN.left;
  const boundsHeight =
    height - COLOR_LEGEND_MARGIN.top - COLOR_LEGEND_MARGIN.bottom;

   const xScale = d3.scaleLinear().range([0, boundsWidth]).domain([min, max]);

   const allTicks = xScale.ticks(7).map((tick, index) => {
      
      return (
        <React.Fragment key={index}>
          <line
            x1={xScale(tick)}
            x2={xScale(tick)}
            y1={0}
            y2={boundsHeight + 10}
            stroke="grey"
          />
          <text
            x={xScale(tick)}
            y={boundsHeight + 20}
            fontSize={9}
            textAnchor="middle"
            fill="grey"
          >
            {tick}
          </text>
        </React.Fragment>
      );
    });

  const hoveredValue = interactionData?.dist;
  const x = hoveredValue ? xScale(hoveredValue) : null;
  const triangleWidth = 9;
  const triangleHeight = 6;
  const triangle = x ? (
    <polygon
      points={`${x},0 ${x - triangleWidth / 2},${-triangleHeight} ${
        x + triangleWidth / 2
      },${-triangleHeight}`}
      fill="grey"
    />
  ) : null;

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const context = canvas?.getContext("2d");

  //   if (!context) {
  //     return;
  //   }

  //   for (let i = 0; i < boundsWidth; ++i) {
  //       context.fillStyle = colorScale((i / boundsWidth) * 1.6 - 1);
  //       console.log('colorScale((i / boundsWidth) * 1.6 - 1)',colorScale((i / boundsWidth) * 1.6 - 1))
  //       context.fillRect(i, 0, 1, boundsHeight);
  //     }
  // }, [width, height, min, max]);

  useEffect(() => {
    //Filling the coloured legend bar
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
  
    if (!context) {
      return;
    }
  
    for (let i = 0; i < boundsWidth; ++i) {
      // Calculate the index in the COLORS array based on the current position
      const colorIndex = Math.floor((i / boundsWidth) * (COLORS.length - 1));
  
      // Interpolate between colors
      const color1 = COLORS[colorIndex];
      const color2 = COLORS[colorIndex + 1];
      const t = (i / boundsWidth) * (COLORS.length - 1) - colorIndex;
      const color = d3.interpolateRgb(color1, color2)(t);
  
      context.fillStyle = color;
      context.fillRect(i, 0, 1, boundsHeight);
    }
  }, [width, height, min, max]);
  

  return (
    <div style={{ width, height }}>
      <div
        style={{
          position: "relative",
          transform: `translate(${COLOR_LEGEND_MARGIN.left - 10}px,
            ${COLOR_LEGEND_MARGIN.top}px`,
        }}
      >
        <canvas ref={canvasRef} width={boundsWidth - 10} height={boundsHeight} />
        <svg
          width={boundsWidth}
          height={boundsHeight}
          style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
        >
          {allTicks}
          {triangle}
        </svg>
      </div>
    </div>
  );
};
