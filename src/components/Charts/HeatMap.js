import React, { useContext, useEffect, useState } from 'react'
import DataContext from '../../store/DataProvider'
import { LABEL } from '../../utils/Contants';

const HeatMap = ({ onDistanceMeasureCalc, direction }) => {
  const pipeCtx = useContext(DataContext);

  const [pipeData, setPipeData] = useState([{ pearsonCorrelation: '' }]);
  const [data, setData] = useState();
  const [lowestThickness, setLowestThickness] = useState();
  const [minPipeSectionId, setMinPipeSectionId] = useState();
  const [maxPipeSectionId, setMaxPipeSectionId] = useState();
  const [minCircumferenceId, setMinCircumferenceId] = useState();
  const [maxCircumferenceId, setMaxCircumferenceId] = useState();

useEffect(() => {
  setLowestThickness(JSON.parse(localStorage.getItem('lowestThickness')))
}, [localStorage.getItem('lowestThickness')]);

useEffect(() => {
  if (data?.length > 0) {
    // // Extract pipe section IDs and circumference IDs
    // const pipeSectionIds = data.map(entry => entry.pipeSectionId);
    // const circumferenceIds = [...new Set(pipeData.map(item => parseInt(item.circumferenceId)))];

    // // Sort arrays in ascending order
    // pipeSectionIds.sort((a, b) => a - b);
    // circumferenceIds.sort((a, b) => a - b);

    // //console.log('Sorted pipeSectionIds:', pipeSectionIds);
    // //console.log('Sorted circumferenceIds:', circumferenceIds);

    // Extract pipe thickness values into a matrix
    const lowestThickness = JSON.parse(localStorage.getItem('lowestThickness'))?.value;

    // const pipeThicknessMatrix = pipeSectionIds.map(pipeSectionId =>
    //   circumferenceIds.map(circumferenceId => {
    //     // Find the corresponding data entry
    //     const entry = data.find(entry => entry.pipeSectionId === pipeSectionId);
    //     // Get the pipeThicknessValue for the current pipeSectionId and circumferenceId
    //     const pipeThicknessValue = parseFloat(entry ? entry[circumferenceId] : 0);
    //     // Subtract the constant value from the pipeThicknessValue
    //     return (pipeThicknessValue - lowestThickness).toFixed(3);
    //   })
    // );

    // console.log('pipeThicknessMatrix: ',pipeThicknessMatrix)

    // // Function to calculate mean
    // const mean = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;

    // // Function to calculate Pearson correlation coefficient
    // const pearsonCorrelation = (x, y) => {
    //   const meanX = mean(x);
    //   const meanY = mean(y);
    //   const n = x.length;

    //   let numerator = 0;
    //   let denominatorX = 0;
    //   let denominatorY = 0;

    //   for (let i = 0; i < n; i++) {
    //     numerator += (x[i] - meanX) * (y[i] - meanY);
    //     denominatorX += (x[i] - meanX) ** 2;
    //     denominatorY += (y[i] - meanY) ** 2;
    //   }

    //   const correlation = numerator / Math.sqrt(denominatorX * denominatorY);

    //   return correlation;
    // };

    // Calculate Pearson correlation coefficient matrix
    // const correlationMatrix = [];
    // const updatedPipeData = pipeData.map(dataEntry => {
    //   const newDataEntry = { ...dataEntry }; // Create a copy of the original data entry
    //   const pipeSectionIdIndex = pipeSectionIds.indexOf(dataEntry.pipeSectionId);

    //   if (pipeSectionIdIndex !== -1) {
    //     correlationMatrix[pipeSectionIdIndex] = [];

    //     for (let j = 0; j < circumferenceIds.length; j++) {
    //       const x = pipeThicknessMatrix[pipeSectionIdIndex];
    //       const y = pipeThicknessMatrix.map(row => row[j]);

    //       const meanX = mean(x);
    //       const meanY = mean(y);

    //       const stdDevX = Math.sqrt(x.reduce((acc, val) => acc + (val - meanX) ** 2, 0) / x.length);
    //       const stdDevY = Math.sqrt(y.reduce((acc, val) => acc + (val - meanY) ** 2, 0) / y.length);

    //       if (stdDevX !== 0 && stdDevY !== 0) {
    //         correlationMatrix[pipeSectionIdIndex][j] = pearsonCorrelation(x, y);
    //       } else {
    //         correlationMatrix[pipeSectionIdIndex][j] = 0; // Set correlation to zero if standard deviation is zero
    //       }

    //       // Assign Pearson coefficient to newDataEntry
    //       newDataEntry.pearsonCorrelation = correlationMatrix[pipeSectionIdIndex][j];
    //     }
    //   }

    //   return newDataEntry;
    // });

    // Create a new array to store updated pipe data
    const updatedPipeData = pipeData.map(dataEntry => {
    const newDataEntry = { ...dataEntry }; // Create a copy of the original data entry
    const pipeThickness = newDataEntry.pipeThickness;

    // Check if pipeThickness is a valid number before subtracting
    if (!isNaN(pipeThickness)) {
      newDataEntry.distanceMeasure = parseFloat((pipeThickness - lowestThickness).toFixed(3));
    } else {
      newDataEntry.distanceMeasure = NaN; // Set to NaN if pipeThickness is not a number
    }

    return newDataEntry;
  });

    // Update pipeData state
    setPipeData(updatedPipeData);
    //console.log('updatedPipeData',updatedPipeData)
  }
}, [data]);

// useEffect(() => {
//   console.log(minPipeSectionId, maxPipeSectionId, minCircumferenceId, maxCircumferenceId)
// }, [minPipeSectionId, maxPipeSectionId, minCircumferenceId, maxCircumferenceId])

  useEffect(()=>{
    if(pipeData?.length > 1) {
      setMinPipeSectionId(Math.min(...pipeData?.map(d => Number(d.pipeSectionId))))
      setMaxPipeSectionId(Math.max(...pipeData?.map(d => Number(d.pipeSectionId))))
      setMinCircumferenceId(Math.min(...pipeData?.map(d => Number(d.circumferenceId))))
      setMaxCircumferenceId(Math.max(...pipeData?.map(d => Number(d.circumferenceId))))

      //Dividing pipeData into 4 sub-datasets pertaining to 4 directional sections of the pipe
      let subPipeData;

      if(direction === LABEL.direction.nw) {
        subPipeData = pipeData?.filter(d => {
          return ((d.pipeSectionId >= minPipeSectionId) && 
                  (d.pipeSectionId <= lowestThickness?.pipeSectionId) && 
                    (d.circumferenceId >= lowestThickness?.circumferenceId) && 
                      (d.circumferenceId <= maxCircumferenceId))
        })
      } else if(direction === LABEL.direction.ne) {
        subPipeData = pipeData?.filter(d => {
          return ((d.pipeSectionId >= lowestThickness?.pipeSectionId) && 
                  (d.pipeSectionId <= maxPipeSectionId) && 
                    (d.circumferenceId >= lowestThickness?.circumferenceId) && 
                      (d.circumferenceId <= maxCircumferenceId)) 
        })
      } else if(direction === LABEL.direction.se) {
        subPipeData = pipeData?.filter(d => {
          return ((d.pipeSectionId >= lowestThickness?.pipeSectionId) && 
                    (d.pipeSectionId <= maxPipeSectionId) && 
                      (d.circumferenceId <= lowestThickness?.circumferenceId) && 
                        (d.circumferenceId >= minCircumferenceId))
        })
      } else if(direction === LABEL.direction.sw) {
        subPipeData = pipeData?.filter(d => {
          return ((d.pipeSectionId >= minPipeSectionId) && 
                    (d.pipeSectionId <= lowestThickness?.pipeSectionId) && 
                      (d.circumferenceId <= lowestThickness?.circumferenceId) && 
                        (d.circumferenceId >= minCircumferenceId))      
                  })
      }

      if(subPipeData?.length > 0)
        //console.log('Direction: ', direction, '------ Sub-Dataset for heatmap: ', subPipeData, '-----max for this sub-dataset----------', Math.max(...subPipeData?.map(d => d.distanceMeasure)))
      

      //Send entire dataset
      //onDistanceMeasureCalc(pipeData)

      //Send sub-dataset
      onDistanceMeasureCalc(direction, subPipeData, pipeData)
    }
  }, [pipeData])

  useEffect(() => {
    if(pipeCtx?.pipeData?.length > 0) {
    setPipeData(pipeCtx?.pipeData);

    const restructuredData = pipeCtx?.pipeData.reduce((acc, curr) => {
      // Find the index of the pipeSectionId in the accumulator array
      const index = acc.findIndex(item => item.pipeSectionId === curr.pipeSectionId);
    
      if (index === -1) {
        // If the pipeSectionId does not exist in the accumulator, add a new object
        acc.push({ pipeSectionId: curr.pipeSectionId, [curr.circumferenceId]: curr.pipeThickness });
      } else {
        // If the pipeSectionId already exists, update the existing object or add a new property
        acc[index][curr.circumferenceId] = curr.pipeThickness;
      }
    
      return acc;
    }, []);
    
    //console.log('restructuring result - ', restructuredData);

  // console.log('restructuring result - ', result);
  // [{
//     "450": "18.684",
//     "460": "18.684",
//     "470": "18.24",
//     "480": "18.684",
//     "490": "18.684",
//     "pipeSectionId": "1798"
// }]

    setData(restructuredData);
}
 //   }
  }, [pipeCtx?.pipeData]);

  return (
    <div className='title'>
      <h5>Heatmap: {direction}</h5>
      <span>{direction} section of the pipe divided at point of lowest thickness {lowestThickness?.value}mm which is at: 
        <br/>Pipe Section ID: {lowestThickness?.pipeSectionId}, Circumference ID: {lowestThickness?.circumferenceId}</span>
    </div>
  )
}

export default HeatMap
