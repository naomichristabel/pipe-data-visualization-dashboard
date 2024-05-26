import * as React from 'react';
import * as THREE from 'three';
import { useAnimatedLayout } from '../ThreePointVis/Layouts.js';
import { COLOURS, PIPE_CONSTANTS } from '../../utils/Contants.js';
import DataContext from '../../store/DataProvider.js';

// re-use for instance computations
const scratchObject3D = new THREE.Object3D();

function updateInstancedMeshMatrices({ mesh, data }) {
  if (!mesh) return;

  // set the transform matrix for each instance
  for (let i = 0; i < data?.length; ++i) {
    const { x, y, z } = data[i];

    scratchObject3D.position.set(x, y, z);
    scratchObject3D.rotation.set(0.5 * Math.PI, 0, 0); // cylinders face z direction
    scratchObject3D.updateMatrix();
    mesh.setMatrixAt(i, scratchObject3D.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
}

let DOT_COLOR = '';

// re-use for instance computations
const scratchColor = new THREE.Color();

const usePointColors = ({ data, selectedPoint, selectedPoints, lowestThicknessPoint }) => {
  const numPoints = data?.length;
  const colorAttrib = React.useRef();
  const colorArray = React.useMemo(() => new Float32Array(numPoints * 3), [
    numPoints,
  ]);

  React.useEffect(() => {
// console.log('selectedPoints',selectedPoints)
// console.log('selectedPoint',selectedPoint)
    
    if(selectedPoints?.length > 0  && !selectedPoint?.pipeSectionId) {  //MULTIPLE POINTS
      for (let i = 0; i < data?.length; ++i) {
        const point = data[i];
        let pointColor = COLOURS.grey;

        if(data[i] === (data[lowestThicknessPoint?.index])){
          pointColor = COLOURS.blue;
        }
  
        // Check if the point matches any of the selected points
        const isSelected = selectedPoints.some(selPoint => {
          //return (point.pipeSectionId === selPoint.pipeSectionId) ;
          return (point.pipeSectionId === selPoint.pipeSectionId) && (point.circumferenceId === selPoint.circumferenceId);
        });

        if (isSelected) {
          if (point.pipeThickness < PIPE_CONSTANTS.minAcceptableThreshold) {
            pointColor = COLOURS.red;
          } else if ((point.pipeThickness > PIPE_CONSTANTS.minAcceptableThreshold) && point.pipeThickness < ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
            pointColor = COLOURS.amber;
          } else if (point.pipeThickness > ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold) && (point.pipeThickness < (0.1 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
            pointColor = COLOURS.yellow;
          } else if (point.pipeThickness > ((0.1 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
            pointColor = COLOURS.green;
          }
        }
          // Set color for the point
        scratchColor.set(pointColor);
        scratchColor.toArray(colorArray, i * 3);
      }
    } else if(selectedPoints?.length > 0 && selectedPoint?.pipeSectionId) { //MULTIPLE POINTS + SINGLE POINT SELECTED
      
      for (let i = 0; i < data?.length; ++i) {
        const point = data[i];
        let pointColor = COLOURS.grey;
        
        if(data[i] === (data[lowestThicknessPoint?.index])){
          pointColor = COLOURS.blue;
        }
      
        // Check if the point matches any of the selected points
        const isSelected = selectedPoints.some(selPoint => {
          //return (point.pipeSectionId === selPoint.pipeSectionId);
          return (point.pipeSectionId === selPoint.pipeSectionId) && (point.circumferenceId === selPoint.circumferenceId);
        });
      
        if (isSelected) {
          if (point.pipeThickness < PIPE_CONSTANTS.minAcceptableThreshold) {
            pointColor = COLOURS.red;
          } else if ((point.pipeThickness > PIPE_CONSTANTS.minAcceptableThreshold) && point.pipeThickness < ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
            pointColor = COLOURS.amber;
          } else if (point.pipeThickness > ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold) && (point.pipeThickness < (0.1 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
            pointColor = COLOURS.yellow;
          } else if (point.pipeThickness > ((0.1 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
            pointColor = COLOURS.green;
          }
        }
      
        //if (selectedPoint && (point.pipeSectionId === selectedPoint.pipeSectionId) ) {
        if (selectedPoint && (point.pipeSectionId === selectedPoint.pipeSectionId) && (point.circumferenceId=== selectedPoint.circumferenceId)) {
          if (selectedPoint.pipeThickness < PIPE_CONSTANTS.minAcceptableThreshold) {
            pointColor = COLOURS.red;
          } else if ((selectedPoint.pipeThickness > PIPE_CONSTANTS.minAcceptableThreshold) && (selectedPoint.pipeThickness < ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold))) {
            pointColor = COLOURS.amber;
          } else if (selectedPoint.pipeThickness > ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold) && selectedPoint.pipeThickness < ((0.10 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
            pointColor = COLOURS.yellow;
          } else if (selectedPoint.pipeThickness > ((0.10 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
            pointColor = COLOURS.green;
          }
        }
      
        // Set color for the point
        scratchColor.set(pointColor);
        scratchColor.toArray(colorArray, i * 3);
      }

    } else { //SINGLE POINT
      if (selectedPoint?.pipeThickness < PIPE_CONSTANTS.minAcceptableThreshold) {
      DOT_COLOR = COLOURS.red
    } else if ((selectedPoint?.pipeThickness > PIPE_CONSTANTS.minAcceptableThreshold) && (selectedPoint?.pipeThickness < ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold))) {
      DOT_COLOR = COLOURS.amber
    } else if (selectedPoint?.pipeThickness > ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold) && selectedPoint?.pipeThickness < ((0.10 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
      DOT_COLOR = COLOURS.yellow
    } else if (selectedPoint?.pipeThickness > ((0.10 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
      DOT_COLOR = COLOURS.green
    }

    for (let i = 0; i < data?.length; ++i) {
        scratchColor.set(
          data[i] === (selectedPoint) ? DOT_COLOR : data[i] === (data[lowestThicknessPoint?.index]) ? COLOURS.blue : COLOURS.grey
        );
        scratchColor.toArray(colorArray, i * 3);
      }

}

    colorAttrib.current.needsUpdate = true;
  }, [data, selectedPoint, selectedPoints, colorArray, lowestThicknessPoint]);

  return { colorAttrib, colorArray };
};

const useMousePointInteraction = ({ data, selectedPoint, onSelectPoint }) => {
  // track mousedown position to skip click handlers on drags
  const mouseDownRef = React.useRef([0, 0]);

const handleHover = e => {
  const { instanceId } = e;

   // index is instanceId if we never change sort order
   const index = instanceId;
   const point = data[index];

   //console.log('point...', point)

   // toggle the point
   if (point === selectedPoint) {
     onSelectPoint(null);
   } else {
     onSelectPoint(point);
   }
};

  const handlePointerDown = e => {
    mouseDownRef.current[0] = e.clientX;
    mouseDownRef.current[1] = e.clientY;
  };

  const handleClick = event => {
    const { instanceId, clientX, clientY } = event;
    const downDistance = Math.sqrt(
      Math.pow(mouseDownRef.current[0] - clientX, 2) +
        Math.pow(mouseDownRef.current[1] - clientY, 2)
    );

    // skip click if we dragged more than 5px distance
    if (downDistance > 5) {
      event.stopPropagation();
      return;
    }

    // index is instanceId if we never change sort order
    const index = instanceId;
    const point = data[index];
  
    //console.log('got point =', point);
    // toggle the point
    if (point === selectedPoint) {
      onSelectPoint(null);
    } else {
      onSelectPoint(point);
    }
  };

  return { handlePointerDown, handleClick, handleHover };
};

const CylinderPoints = ({ data, layout, selectedPoints, selectedPoint, onSelectPoint }) => {
  const meshRef = React.useRef();
  const numPoints = data?.length;

  const [lowestThicknessPoint, setLowestThicknessPoint] = React.useState();

  const pipeCtx = React.useContext(DataContext);

  // run the layout, animating on change
  useAnimatedLayout({
    data,
    layout,
    onFrame: () => {
      updateInstancedMeshMatrices({ mesh: meshRef.current, data });
    },
  });

  // update instance matrices only when needed
  React.useEffect(() => {
    
    updateInstancedMeshMatrices({ mesh: meshRef.current, data });
  }, [data, layout]);

  // Locate the point of lowest thickness
  React.useEffect(() => {
    let lowestPoint = JSON.parse(localStorage.getItem('lowestThickness'))
    setLowestThicknessPoint(lowestPoint)
  }, [localStorage.getItem('lowestThickness')])

  const { handleClick, handlePointerDown, handleHover } = useMousePointInteraction({
    data,
    selectedPoint,
    onSelectPoint,
  });

  const { colorAttrib, colorArray } = usePointColors({ data, selectedPoint, selectedPoints, lowestThicknessPoint });
 
   return (
    <>
    <instancedMesh
      ref={meshRef}
      args={[null, null, numPoints]}
      frustumCulled={false}
      onPointerOver={handleHover}
      onPointerOut={handleHover}
      //onClick={handleClick}
      onPointerDown={handlePointerDown}
    >
      <cylinderBufferGeometry attach="geometry" args={[0.5, 0.5, 0.15, 32]}>
        <instancedBufferAttribute
          ref={colorAttrib}
          attachObject={['attributes', 'color']}
          args={[colorArray, 3]}
        />
      </cylinderBufferGeometry>
      <meshStandardMaterial
        attach="material"
        vertexColors={THREE.VertexColors}
      />
    </instancedMesh>
    {selectedPoint && (
      <group
        position={[
          selectedPoint.x,
          selectedPoint.y,
          selectedPoint.z,
        ]}
      >
        <pointLight
          distance={20}
          position={[0, 0, 0.3]}
          intensity={3}
          decay={30}
          color="#EEEEEE"
        />
        {/* <pointLight
          position={[0, 0, 0]}
          decay={1}
          distance={5}
          intensity={1.5}
          color="#2f0"
        /> */}
      </group>
    )}
    </>
  );
};

export default CylinderPoints;
