import * as React from 'react';
import { useSpring } from 'react-spring/three';
import { PIPE_CONSTANTS } from '../../utils/Contants.js';
import DataContext from '../../store/DataProvider.js';

// function generateRandomNumbersInRange(min, max, count) {
//   const randomNumbers = [];
//   for (let i = 0; i < count; i++) {
//     const randomNumber = Math.random() * (max - min) + min;
//     randomNumbers.push(randomNumber);
//   }

//   //console.log('random...', randomNumbers)
//   return randomNumbers;
//   }

// function generateScaledNumbers(rangeStart, rangeEnd, scale) {
//     const numbers = [];
//     for (let i = rangeStart; i <= rangeEnd; i += scale) {
//       numbers.push(i);
//     }

//     return numbers;
// }

// Function to calculate y and z coordinates for a given circumference point
function calculateCircumferencePointCoordinates(circumferenceId, totalCircumferencePoints, radius) {
  var theta = (circumferenceId / totalCircumferencePoints) * Math.PI * 2;
  //console.log('theta',theta)

  var y = radius * Math.cos(theta);
  //console.log('sin(theta)', Math.sin(theta), 'cos(theta): ', Math.cos(theta))
  var z = radius * Math.sin(theta);

  return { y: y, z: z };
}

function gridLayout(data) {
  const numPoints = data?.length;
  const numCols = Math.ceil(Math.sqrt(numPoints));
  const numRows = numCols;

  // Extract pipeSectionId, circumferenceIds, pipeThickness values as numbers
  const pipeSectionIds = data.map(item => parseInt(item.pipeSectionId));
  const circumferenceIds = data.map(item => parseInt(item.circumferenceId));
  const pipeThicknessValues = data.map(item => parseFloat(item.pipeThickness));

  // Find minimum and maximum values
  const minValueCircumference = Math.min(...circumferenceIds);

  //console.log('circumferenceIds',circumferenceIds)

  // Find number of circumference IDs
  // const noOfCircumferenceIds = data?.filter(d => d.pipeSectionId === data[0].pipeSectionId)?.map(d => d.circumferenceId)?.length;
  const noOfCircumferenceIds = data?.map(d => d.circumferenceId)?.length;

  const minValue = Math.min(...pipeSectionIds);
  const maxValue = Math.max(...pipeSectionIds);

  // Find lowest thickness value
  const lowestThicknessVal = Math.min(...pipeThicknessValues)
  const indexOfLowestThicknessVal = pipeThicknessValues.findIndex(val => val === Math.min(...pipeThicknessValues))

  const pipeSectionIdOfLowestThicknessVal = parseInt(data[indexOfLowestThicknessVal]?.pipeSectionId)
  const circumferenceIdOfLowestThicknessVal = parseInt(data[indexOfLowestThicknessVal]?.circumferenceId)
  const scaledCircumferenceIdOfLowestThicknessVal = (circumferenceIdOfLowestThicknessVal - minValueCircumference) / PIPE_CONSTANTS.circumferenceScaleFactor;

  const yzLowestThicknessVal = calculateCircumferencePointCoordinates(scaledCircumferenceIdOfLowestThicknessVal, noOfCircumferenceIds, PIPE_CONSTANTS.pipeOuterRadius);

  const lowestThickness = {
    value: lowestThicknessVal,
    index: indexOfLowestThicknessVal,
    x: (pipeSectionIdOfLowestThicknessVal - minValue) / PIPE_CONSTANTS.pipeSectionScaleFactor,
    y: yzLowestThicknessVal.y,
    z: yzLowestThicknessVal.z,
    pipeSectionId: pipeSectionIdOfLowestThicknessVal,
    circumferenceId: circumferenceIdOfLowestThicknessVal
  }

  localStorage.setItem('lowestThickness', JSON.stringify(lowestThickness))

  //console.log('lowestThickness',lowestThickness)
  
  //const randomNumbers = generateRandomNumbersInRange(-PIPE_CONSTANTS.pipeInnerRadius, PIPE_CONSTANTS.pipeInnerRadius, pipeSectionIds?.length);
  //const scaledNumbers = generateScaledNumbers(minValue, maxValue, PIPE_CONSTANTS.pipeSectionScaleFactor);

  if(data) {
    for (let i = 0; i < numPoints; ++i) {
      const datum = data[i];
      const col = (i % numCols) - numCols / 2;
      const row = Math.floor(i / numCols) - numRows / 2;

      datum.x = (parseInt(data[i].pipeSectionId) - minValue) / PIPE_CONSTANTS.pipeSectionScaleFactor
      //datum.x = scaledNumbers[i + 1];
      //datum.y = randomNumbers[i];
      
      //Uncomment for pipe with points only along X-axis
        // datum.y = 0;
        // datum.z = PIPE_CONSTANTS.pipeOuterRadius;

      var circumferenceId = (parseInt(data[i].circumferenceId) - minValueCircumference) / PIPE_CONSTANTS.circumferenceScaleFactor ;
      
      //Uncomment for pipe with circumference IDs
         var { y, z } = calculateCircumferencePointCoordinates(circumferenceId, noOfCircumferenceIds, PIPE_CONSTANTS.pipeOuterRadius);
        datum.y = y;
        datum.z = z;

      //datum.x = (col * 1.05);
      //datum.y = row * 1.05;

      //console.log('co ordinates (x,y,z): ', datum.x, datum.y, datum.z)
    }
  }
}

export const useLayout = ({ data, layout = 'grid' }) => {
  React.useEffect(() => {
    switch (layout) {
      case 'grid':
      default: {
        gridLayout(data);
      }
    }
  }, [data, layout]);
};

function useSourceTargetLayout({ data, layout }) {
  // prep for new animation by storing source
  React.useEffect(() => {
    if(data) {
      for (let i = 0; i < data?.length; ++i) {
        data[i].sourceX = data[i].x || 0;
        data[i].sourceY = data[i].y || 0;
        data[i].sourceZ = data[i].z || 0;
      }
    }
  }, [data, layout]);

  // run layout
  useLayout({ data, layout });

  // store target
  React.useEffect(() => {
    if(data) {
      for (let i = 0; i < data?.length; ++i) {
        data[i].targetX = data[i].x;
        data[i].targetY = data[i].y;
        data[i].targetZ = data[i].z;
      }
    } 
  }, [data, layout]);
}

function interpolateSourceTarget(data, progress) {
  if(data) {
    for (let i = 0; i < data?.length; ++i) {
      data[i].x = (1 - progress) * data[i].sourceX + progress * data[i].targetX;
      data[i].y = (1 - progress) * data[i].sourceY + progress * data[i].targetY;
      data[i].z = (1 - progress) * data[i].sourceZ + progress * data[i].targetZ;
    }
  }
}

export function useAnimatedLayout({ data, layout, onFrame }) {
  // compute layout remembering initial position as source and
  // end position as target
  useSourceTargetLayout({ data, layout });

  // do the actual animation when layout changes
  const prevLayout = React.useRef(layout);
  useSpring({
    animationProgress: 1,
    from: { animationProgress: 0 },
    reset: layout !== prevLayout.current,
    onFrame: ({ animationProgress }) => {
      // interpolate based on progress
      interpolateSourceTarget(data, animationProgress);
      // callback to indicate data has updated
      onFrame({ animationProgress });
    },
  });
  prevLayout.current = layout;
}
