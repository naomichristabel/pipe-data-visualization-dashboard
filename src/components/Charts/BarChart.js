// // // import React, { useEffect, useRef, useContext } from 'react';
// // // import DataContext from '../../store/DataProvider'; 
// // // import * as Plot from "@observablehq/plot";

// // // const BarChart = () => {
// // //   const pipeCtx = React.useContext(DataContext);

// // //   const [data, setData] = React.useState([]);

// // //   React.useEffect(() => {console.log('state data in CP component...',data)}, [data])

// // //   useEffect(() => {
// // //      console.log('in useEff context data : ', pipeCtx.pipeData)
// // //     setData(pipeCtx.pipeData)
// // //   }, [pipeCtx?.pipeData]);

// // //   return (
// // //     <div>Bar Chart here</div>
// // //   );
// // // }

// // // export default BarChart;



// import * as Plot from "@observablehq/plot";
// import { useRef, useEffect, useState, useContext } from "react";
// import DataContext from '../../store/DataProvider'; 
// import { Dropdown } from "./Dropdown";
// import { PIPE_CONSTANTS, COLOURS } from "../../utils/Contants";

// export const prepareXAxisData = (data) => {
//    // Create a map to store unique combinations of count, countPercent, and pipeThickness
//    const uniqueCombinations = {};

//    // Iterate through the data array
//    const filteredData = data.filter(obj => {
//    // Generate a key based on the combination of count, countPercent, and pipeThickness
//    const key = `${obj.count}-${obj.countPercent}-${obj.pipeThickness}`;
//    // If the key is not in the map, add it and return true (keep the object)
//    if (!uniqueCombinations[key]) {
//        uniqueCombinations[key] = true;
//        return true;
//    }
//    // If the key already exists in the map, return false (remove the duplicate object)
//    return false;
//    });

//    // filteredData now contains the array with unique combinations of count, countPercent, and pipeThickness
//    //console.log(filteredData)
//    return filteredData;

// }

// export const prepareYAxisData = (data) => {
//   // Create a Set to store unique count values
//   const uniqueCountPercents = new Set();

//   // Iterate through the data and add each count to the Set
//   data.forEach(item => {
//       uniqueCountPercents.add(item.countPercent);
//   });

//   // Get the size of the Set, which represents the number of unique count values
//   return uniqueCountPercents.size;
// }

// const BarChart = () => {
//   const plotRef = useRef();
//   const [sort, setSort] = useState("No sort");

//   const pipeCtx = useContext(DataContext);

//   const [data, setData] = useState([]);

//   // Define color function to apply colors based on pipeThickness values
//   const color = (d) => {
//   if (d.pipeThickness < PIPE_CONSTANTS.minAcceptableThreshold) {
//     return COLOURS.red
//   } else if ((d.pipeThickness > PIPE_CONSTANTS.minAcceptableThreshold) && (d.pipeThickness < ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold))) {
//     return COLOURS.amber
//   } else if (d.pipeThickness > ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold) && d.pipeThickness < ((0.10 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
//     return COLOURS.yellow
//   } else if (d.pipeThickness > ((0.10 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
//     return COLOURS.green
//   }
//   }

//   useEffect(() => {
//     setData(pipeCtx.pipeData)
//   }, [pipeCtx?.pipeData]);

//   useEffect(() => {
//     if(data?.length > 0) {
      
//     const filteredData = prepareXAxisData(data);
//     const numberOfUniqueCountPercents = prepareYAxisData(data);

//     const barChart = Plot.plot({
//         marks: [
//           Plot.barY(filteredData, {
//             x: d => Number(d.pipeThickness),
//             y: d => Number(d.countPercent),
//             fill: color, // Apply color function to fill bars
//             sort:
//               sort === "No sort"
//                 ? null
//                 : { x: "y", reverse: sort === "Descending" }
//           }),
//           Plot.axisX({
//             anchor: "bottom",
//             label: "Pipe Thickness (mm)",
//             labelAnchor: "center",
//             labelOffset: 50,
//             labelArrow: "right",            
//             tickValues: [...new Set(filteredData.map(d => Math.round(Number(d.pipeThickness))))].sort((a, b) => a - b),
//             fontSize: 14, // Increase font size of the label
//             tickSize: 4, // Specify tick size
//             lineWidth: 1, // Adjust axis line width
//           }),
//           Plot.axisY({
//             anchor: "left",
//             label: "Percent",
//             labelAnchor: "center",
//             labelOffset: 50,
//             ticks: numberOfUniqueCountPercents, // Specify number of ticks
//             // tickFormat: "d", // Format tick labels as plain integers
//             fontSize: 14,
//             tickSize: 4, // Specify tick size
//             lineWidth: 1, // Adjust axis line width
//           }),  
//         ],
//         y: { grid: true },
//         marginTop: 50,
//         marginBottom: 50,
//         marginLeft: 50,
//       });
//       plotRef.current.append(barChart);

//       return () => barChart.remove();
//     } 
//   }, [data, sort]);

//   return (
//     <>
//       <div className='title'>
//           <h4>Bar Chart</h4>
//       </div>
//       <Dropdown
//         title="Sort by"
//         onChange={(event) => setSort(event.target.value)}
//         options={["No sort", "Descending", "Ascending"]}
//       />
//       <div ref={plotRef} className='controls bar-chart'></div>
//     </>
//   );
// }

// export default BarChart;
