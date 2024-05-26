import * as React from 'react';
import { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import Controls from './Controls.js';
import Cylinder from '../Pipeline/Cylinder.js';
import CylinderPoints from '../Pipeline/CylinderPoints.js';
import Effects from './Effects.js';
import DataContext from '../../store/DataProvider.js';
import { PIPE_CONSTANTS, COLOURS } from '../../utils/Contants.js';
import XZPlane from '../Pipeline/XZPlane.js';
import YZPlane from '../Pipeline/YZPlane.js';
import XYPlane from '../Pipeline/XYPlane.js';
import CalloutBox from './CalloutBox.js';

const ThreePointVis = ({ data, layout, selectedPoint, onSelectPoint, showPlanes, showPipe, usingStripPoints }, ref) => {
  const pipeCtx = React.useContext(DataContext);
  const [pipeData, setPipeData] = React.useState([]);
  const [pipeLength, setPipeLength] = React.useState();
  const [selectedPoints, setSelectedPoints] = React.useState([]);
  const [lowestThicknessPoint, setLowestThicknessPoint] = React.useState();

  // Locate the point of lowest thickness
  React.useEffect(() => {
    setLowestThicknessPoint(JSON.parse(localStorage.getItem('lowestThickness')))
  }, [localStorage.getItem('lowestThickness')])

  React.useEffect(() => {
    //console.log('using strip points?',usingStripPoints)

    const allValuesFalse = Object.values(usingStripPoints).every(value => value === false);
   
    let selectedOptions = pipeCtx?.selectedOptions;

    // console.log('selectedOptions: ', selectedOptions)

    if(selectedOptions && selectedOptions.length > 0 && allValuesFalse) {
      let newPoints = [];
      selectedOptions.forEach(option => {
          switch(option) {
              case 'a':
                  newPoints.push(...pipeData?.filter(d => d.pipeThickness < PIPE_CONSTANTS.minAcceptableThreshold));
                  break;
              case 'b':
                  newPoints.push(...pipeData?.filter(d => (d.pipeThickness > PIPE_CONSTANTS.minAcceptableThreshold) && (d.pipeThickness < ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold))));
                  break;
              case 'c':
                  newPoints.push(...pipeData?.filter(d => (d.pipeThickness > (0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold) && (d.pipeThickness < ((0.10 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold))));
                  break;
              case 'd':
                  newPoints.push(...pipeData?.filter(d => d.pipeThickness > (0.10 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold));
                  break;
              default:
                  break;
          }
      });
      
      // Remove duplicates from newPoints
      const uniqueNewPoints = [...new Set(newPoints)];
      setSelectedPoints(uniqueNewPoints);
    } else if(!allValuesFalse) {
      const whichStrip = Object.keys(usingStripPoints).find(key => usingStripPoints[key] === true);
      setSelectedPoints(pipeCtx?.stripPoints[whichStrip]);
    } else {
      setSelectedPoints([]);
    }

  }, [pipeCtx?.selectedOptions, usingStripPoints])
  
  React.useEffect(()=>{
   //console.log('in useEff context data : ', pipeCtx.pipeData)
   
    if(pipeCtx?.pipeData?.length > 0) {
      setPipeData(pipeCtx.pipeData)
      const maximumThicknessVal = Math.max(...pipeCtx.pipeData.map(item => parseInt(item.pipeSectionId)))
      const minimumThicknessVal = Math.min(...pipeCtx.pipeData.map(item => parseInt(item.pipeSectionId)))
      setPipeLength(( maximumThicknessVal - minimumThicknessVal) / PIPE_CONSTANTS.pipeSectionScaleFactor)
    }
  },[pipeCtx?.pipeData])

  // React.useEffect(() => {console.log('state data in CP component...',pipeData)}, [pipeData])

  React.useEffect(() => {
    //console.log('state data of selected points in parent ThreeVis component...',selectedPoints)
  }, [selectedPoints])

  const controlsRef = React.useRef();
  React.useImperativeHandle(ref, () => ({
    resetCamera: () => {
      return controlsRef.current?.resetCamera();
    },
  }));

  return (
    <Canvas camera={{ position: [0, 0, 50], far: 15000 }} >
      <color
        attach="background"
        args={[COLOURS.darkBlue]}
      />
        <Suspense fallback={null}>
          <Controls ref={controlsRef}/>
          <ambientLight color="#ffffff" intensity={0.1} />
          <hemisphereLight
            color="#ffffff"
            skyColor="#ffffbb"
            groundColor="#080820"
            intensity={1.0}
          />
          <group position={[10 - lowestThicknessPoint?.x, 0, 0]}>
            <Cylinder height={pipeLength} lowestThicknessPoint={lowestThicknessPoint} showPipe={showPipe}/>

            {showPlanes && 
            <>
              <XYPlane lowestThicknessPoint={lowestThicknessPoint} width={pipeLength + 100} height={PIPE_CONSTANTS.pipeOuterRadius * 2 + 20}/>
              <YZPlane lowestThicknessPoint={lowestThicknessPoint} width={PIPE_CONSTANTS.pipeOuterRadius * 2 + 20} height={PIPE_CONSTANTS.pipeOuterRadius * 2 + 20}/>
            </>
            // Not used
            /* <XZPlane lowestThicknessPoint={lowestThicknessPoint} width={pipeLength} height={PIPE_CONSTANTS.pipeOuterRadius * 2 + 20}/> */
            }


            <CalloutBox position={{ x: lowestThicknessPoint?.x, y: lowestThicknessPoint?.y + 10, z: lowestThicknessPoint?.z }} text="LOWEST THICKNESS VALUE FOUND HERE" />

            <CylinderPoints 
              data={pipeData}
              layout={layout}
              selectedPoints={selectedPoints}
              selectedPoint={selectedPoint}
              onSelectPoint={onSelectPoint}
             />
          </group>
            <Effects />
        </Suspense>
    </Canvas>
  );
};

export default  React.forwardRef(ThreePointVis);
