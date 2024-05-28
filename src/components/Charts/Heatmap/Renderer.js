import { useMemo, useEffect, useState, useContext } from "react";
import * as d3 from "d3";
import { MARGIN, COLOURS, LABEL } from '../../../utils/Contants';
import styles from "./renderer.module.css";
import DataContext from "../../../store/DataProvider";

export const Renderer = ({
  direction,
  width,
  height,
  //data,
  newFullDataset,
  setHoveredCell,
  colorScale,
}) => {

  const [lowestThickness, setLowestThickness] = useState();
  const [heatMapsData, setHeatMapsData] = useState({ });

  const pipeCtx = useContext(DataContext);
  
  useEffect(() => {
    setLowestThickness(JSON.parse(localStorage.getItem('lowestThickness')))
  }, [localStorage.getItem('lowestThickness')]);

  useEffect(() => {
    setHeatMapsData(pipeCtx?.heatMapsData)
  }, [pipeCtx?.heatMapsData]);

  // Mapping from direction string to heatMapsData key
  const directionMap = {
    [LABEL.direction.nw]: "northWest",
    [LABEL.direction.sw]: "southWest",
    [LABEL.direction.ne]: "northEast",
    [LABEL.direction.se]: "southEast",
  };

  // Determine the key to use based on the direction prop
  const directionKey = directionMap[direction];

  const data = heatMapsData[directionKey];

  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const maxCircumferenceId = Math.max(...newFullDataset?.map(d => Number(d.circumferenceId)) || []);
  const minCircumferenceId = Math.min(...newFullDataset?.map(d => Number(d.circumferenceId)) || []);

  const lowestThicknessCircumferenceId = lowestThickness?.circumferenceId;

  let filteredData;

  if(direction?.includes?.('North')) {
    filteredData = data?.filter(d => 
      d.y >= lowestThicknessCircumferenceId && 
      d.y <= maxCircumferenceId
    );
  } else if(direction?.includes?.('South')) {
    filteredData = data?.filter(d => 
      d.y >= minCircumferenceId && 
      d.y <= lowestThicknessCircumferenceId
    );
  } 

  const allYGroups = useMemo(() => [...new Set(data?.map((d) => d.y))], [data]);

  // const allXGroups = useMemo(
  //   () => [...new Set(data?.map((d) => String(d.x)))],
  //   [data]
  // );

  const allXGroups = useMemo(() => {
    return [...new Set(data?.filter(d => d.hasOwnProperty('distanceMeasure')).map(d => String(d.x)))];
  }, [data]);
  
  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups?.sort((a, b) => a - b)) // Sort in ascending order
      .padding(0.1);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsHeight])
      .domain(allYGroups.sort((a, b) => a - b)) // Sort in ascending order
      .padding(0.1);
  }, [data, height]);

  const allRects = data?.map((d, i) => {

    const xPos = xScale(String(d.x));
    const yPos = boundsHeight - yScale(d.y); // Subtract yPos from boundsHeight to reverse direction

    //if (d.value === null || !xPos || !yPos) {
    if (!xPos || !yPos) {
      return;
    }

    return (
      <rect
        key={i}
        x={xPos}
        y={yPos}
        className={styles.rectangle}
        width={d.distanceMeasure ? xScale.bandwidth() + 3 : xScale.bandwidth() + 1}
        height={d.distanceMeasure ? yScale.bandwidth() + 1 : yScale.bandwidth() + 0.25}
        fill={(d.hasOwnProperty('distanceMeasure') && d.distanceMeasure < 1.6) ? colorScale(d.distanceMeasure) : COLOURS.veryLightGrey}
        // fill={(d.distanceMeasure) ? colorScale(d.distanceMeasure) : COLOURS.veryLightGrey}
        //fill={(d.distanceMeasure !== null) ? colorScale(d.distanceMeasure) : "#F8F8F8"}
        // fill={d.pearsonCorrelation ? colorScale(d.pearsonCorrelation) : "#F8F8F8"}
        onMouseEnter={(e) => {
          if (d.hasOwnProperty('distanceMeasure')) {
            setHoveredCell({
              xLabel: String(d.x),
              yLabel: String(d.y),
              xPos: xPos + xScale.bandwidth() + MARGIN.left,
              yPos: yPos + xScale.bandwidth() / 2 + MARGIN.top,
              // value: d.value ? Math.round(d.value * 100) / 100 : null,
              dist: d.distanceMeasure ? d.distanceMeasure.toFixed(3) : null
            });
          }
        }}
      />
    );
  });

  const xLabelInterval = 2; // Display label for every 100 x value
  const yLabelInterval = 5; // Display label for every 20 y value

  const xLabels = allXGroups
  .filter((name, index) => index % xLabelInterval === 0) // Filter every 100th x value
  .map((name, i) => {
    const xPos = xScale(name) + xScale.bandwidth() / 2;
    const yPos = boundsHeight + 20; 

    return (
      <text
        key={i}
        x={xPos}
        y={yPos}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={8}
        stroke="none"
        fill="black"
        transform={`rotate(-90, ${xPos}, ${yPos})`} // Rotate the text by -90 degrees
      >
        {name}
      </text>
    );
  });

  const yLabels = allYGroups
  .filter((name, index) => index % yLabelInterval === 0) // Filter every 20th y value
  .map((name, i) => {
    const yPos = boundsHeight - yScale(name) + (yScale.bandwidth() / 2) + 30;

    return (
      <text
        key={i}
        x={-5}
        y={yPos + (yScale.bandwidth() / 2) - 30}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={8}
        fill="black"
      >
        {name}
      </text>
    );
  });

  // const xLabels = allXGroups.map((name, i) => {
  //   const xPos = xScale(name) + xScale.bandwidth() / 2;
  //   const yPos = boundsHeight + 40; 

  //   //if (name && Number(name) % 10 === 0) {
  //     return (
  //       <text
  //         key={i}
  //         x={xScale(name)}
  //         y={yPos}
  //         textAnchor="middle"
  //         dominantBaseline="middle"
  //         fontSize={8}
  //         stroke="none"
  //         fill="white"
  //         transform={`rotate(-90, ${xPos}, ${yPos})`} // Rotate the text by -90 degrees
  //       >
  //         {name}
  //       </text>
  //     );
  //   //}
  // });

  // const yLabels = allYGroups.map((name, i) => {
  //   const yPos = boundsHeight - yScale(name) + (yScale.bandwidth() / 2) + 30;
  //   // if (yPos && i % 2 === 0) {
  //     return (
  //       <text
  //         key={i}
  //         x={-5}
  //         y={yPos + (yScale.bandwidth() / 2) - 40}
  //         textAnchor="end"
  //         dominantBaseline="middle"
  //         fontSize={8}
  //         fill="white"
  //       >
  //         {name}
  //       </text>
  //     );
  //  // }
  // });

  const xAxisLabel = 
    <text
        x={boundsWidth / 2} // Center the label horizontally
        y={boundsHeight + MARGIN.bottom - 10} // Adjust the position vertically
        textAnchor="middle" // Center the text
        dominantBaseline="hanging" // Position the text below the axis
        fontSize={8}
        fill={COLOURS.darkGrey}
    >
        <tspan>{direction.includes('West') && '←  '}</tspan>
          Pipe Section ID
        <tspan>{direction.includes('East') && '  →'}</tspan>
    </text>

  const yAxisLabel = 
      <text
        x={-boundsHeight / 2} // Center the label vertically
        y={-MARGIN.left + 20} // Adjust the position horizontally
        textAnchor="middle" // Center the text
        dominantBaseline="hanging" // Position the text to the left of the axis
        fontSize={8}
        fill={COLOURS.darkGrey}
        transform={`rotate(-90)`} // Rotate the label for vertical orientation
      >
        <tspan>{direction.includes('South') && '←  '}</tspan>
          Circumference ID
        <tspan>{direction.includes('North') && '  →'}</tspan>
    </text>


  return (
    <svg
      width={width}
      height={height + MARGIN.top + MARGIN.bottom}
      onMouseLeave={() => setHoveredCell(null)}
    >
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >

      {/* Background rectangle */}
      <rect
        x={0}
        y={0}
        width={width - 100}
        height={height - MARGIN.top - MARGIN.bottom + 6}
        fill={COLOURS.veryLightGrey} 
      />

        {allRects}
        {xLabels}
        {yLabels}

        {xAxisLabel}
        {yAxisLabel}

      </g>
    </svg>
  );
};
