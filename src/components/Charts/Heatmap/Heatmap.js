import { useState, useContext, useEffect } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";
import { COLOR_LEGEND_HEIGHT, COLOURS } from "../../../utils/Contants";
import { ColorLegend } from "./ColorLegend";
import * as d3 from "d3";
import { COLORS, THRESHOLDS } from '../../../utils/Contants';
import DataContext from "../../../store/DataProvider";

export const Heatmap = ({ direction, width, height, newPipeData, newFullDataset }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [maxValue, setMaxValue] = useState();
  const [minValue, setMinValue] = useState();

  const pipeCtx = useContext(DataContext);

  const data = pipeCtx?.pipeData?.map(entry => ({
    x: entry.pipeSectionId,
    y: entry.circumferenceId,
    value: parseFloat(entry.pipeThickness)
  }));

    // Adding distanceMeasure to pipeData
    const updatedData = data.map(dataEntry => {
        // Find the corresponding entry in newPipeData based on x and y values
        const correspondingEntry = newPipeData?.find(pipeEntry => pipeEntry.pipeSectionId === dataEntry.x && pipeEntry.circumferenceId === dataEntry.y);
    
        // If a corresponding entry is found, add its pearsonCorrelation value to the dataEntry
        if (correspondingEntry) {
        return {
            ...dataEntry,
            distanceMeasure: correspondingEntry.distanceMeasure
            //pearsonCorrelation: correspondingEntry.pearsonCorrelation
        };
        } 
    
        // If no corresponding entry is found, return the original dataEntry
        return dataEntry;
    });
  
    // updatedData now contains the data array with added pearsonCorrelation property
    //   console.log(updatedData, 'aT LEAST NOW??');

  // Color scale is computed here bc it must be passed to both the renderer and the legend
  const values = updatedData
    ?.map((d) => d.distanceMeasure)
    ?.filter((d) => d !== null);

  const max = d3.max(values) || 0;

  const colorScale = d3
    .scaleLinear()
    .domain(THRESHOLDS.map((t) => t * max))
    .range(COLORS);

//Sending latest min and max of pearsonCoefficient to ColorLegend
 useEffect(() => {
    const values = updatedData
        ?.map((d) => d.distanceMeasure)
        ?.filter((d) => d !== null);
    
    if(values && values.length > 0) {
    // if(values && values.length > 0 && values[0] !== undefined) {
        // setMaxValue(d3.max(values))
        // setMinValue(d3.min(values))
        setMaxValue(1.5)
        setMinValue(0)
    }
  
 }, [updatedData])

  return (
    <div style={{ position: "relative" }} >
      <Renderer
        width={width}
        height={height - COLOR_LEGEND_HEIGHT}
        data={updatedData}
        newFullDataset={newFullDataset}
        direction={direction}
        setHoveredCell={setHoveredCell}
        colorScale={colorScale}
      />
      <Tooltip
        interactionData={hoveredCell}
        width={width}
        height={height - COLOR_LEGEND_HEIGHT}
        colorScale={colorScale}
      />
      <div style={{ width: "100%", marginLeft: '60px', marginTop: '-8%' }}>
        <ColorLegend
          height={COLOR_LEGEND_HEIGHT}
          width={width - 50}
          max={maxValue}
          min={minValue}
          colorScale={colorScale}
          interactionData={hoveredCell}
        />
      </div>
    </div>
  );
};
