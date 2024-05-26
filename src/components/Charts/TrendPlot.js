import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useContext, useState } from "react";
import { COLOURS, LABEL } from "../../utils/Contants.js";
import DataContext from "../../store/DataProvider.js";

const calculateSlope = (xAxisValues, yAxisValues) => {
    // Calculate the mean of indexPosition and pipeThicknessValue
    const meanXAxisValue = xAxisValues.reduce((acc, val) => acc + val, 0) / xAxisValues.length;
    const meanYAxisValue = yAxisValues.reduce((acc, val) => acc + val, 0) / yAxisValues.length;

    // Calculate the numerator and denominator of the slope formula
    const numerator = xAxisValues.reduce((acc, val, i) => acc + (val - meanXAxisValue) * (yAxisValues[i] - meanYAxisValue), 0);
    const denominator = xAxisValues.reduce((acc, val) => acc + (val - meanXAxisValue) ** 2, 0);

    // Calculate the slope
    const slope = numerator / denominator;

    return slope;
}

const TrendPlot = ({ direction }) => {
    const plotRef = useRef();

    const [coordinates, setCoordinates] = useState([]);

    const [northPoints, setNorthPoints] = useState([]);
    const [southPoints, setSouthPoints] = useState([]);
    const [eastPoints, setEastPoints] = useState([]);
    const [westPoints, setWestPoints] = useState([]);

    const [slope, setSlope] = useState();
    const [minSlopeDirection, setMinSlopeDirection] = useState(null);

    const pipeCtx = useContext(DataContext);

//     // Line Mark
//     useEffect(() => {
//       if(coordinates?.length > 0) {
// //console.log(coordinates)
//         const linePlot = Plot.plot({
//                 marks: [
//                     Plot.frame({fill: COLOURS.darkGrey}),
//                     Plot.gridY({stroke: COLOURS.grey, strokeOpacity: 1}),
//                     Plot.line(coordinates?.map((d, i) => {
//                         //console.log('x: ',d.pipeSection, ' y: ', parseFloat(d.pipeThickness))
//                         return ({ x: d.pipeSection, y: parseFloat(d.pipeThickness) })
//                     }), { x: "x", y: "y", stroke: "white", strokeWidth: 3, tip: true }),  
//                 ],
//                 x: { label: "Index", labelAnchor: "center", labelOffset: 30 },
//                 y: { label: "Pipe Thickness (mm)", labelAnchor: "center", labelOffset: 40 },
//                 // marginTop: 20,
//                 // marginBottom: 20,
//                 // marginLeft: 20,
//                 // marginRight: 20,
//             });

//             // plotRef.current.append(linePlot);

//             // return () => linePlot.remove();
//         }
//     }, [coordinates])

//     useEffect(() => {
//         if (pipeCtx?.pipeData?.length > 0) {
        
//         let sectionMin = Math.min(...pipeCtx?.pipeData?.map(d => d.pipeSectionId))

//         setCoordinates(
//             pipeCtx?.pipeData?.map(d => ({
//                 pipeThickness: d.pipeThickness,
//                 pipeSection: d.pipeSectionId - sectionMin
//             })))     
//         }
//     }, [pipeCtx?.pipeData]);

    //Linear Regression Mark
    // useEffect(() => {
    //     setLowestThickness(JSON.parse(localStorage.getItem('lowestThickness')))
    // }, [localStorage.getItem('lowestThickness'), direction]);

    useEffect(() => {
    
      let lowestThickness = JSON.parse(localStorage.getItem('lowestThickness'));

      if (pipeCtx?.pipeData?.length > 0) {
        setNorthPoints(pipeCtx?.pipeData?.filter(d => ((Number(d.circumferenceId) >= lowestThickness?.circumferenceId) && (Number(d.circumferenceId) <= lowestThickness?.circumferenceId + 100) )
                                                        && ((Number(d.pipeSectionId) >= lowestThickness?.pipeSectionId - 50) && (Number(d.pipeSectionId) <= lowestThickness?.pipeSectionId + 50) )
                    ).map((d, index) => ({indexPosition: index, pipeThickness: d.pipeThickness, pipeSectionId: d.pipeSectionId, circumferenceId: d.circumferenceId})))
        
        setSouthPoints(pipeCtx?.pipeData?.filter(d => ( (Number(d.circumferenceId) >= lowestThickness?.circumferenceId - 100) && (Number(d.circumferenceId) <= lowestThickness?.circumferenceId) )
                                                            && ((Number(d.pipeSectionId) >= lowestThickness?.pipeSectionId - 50) && (Number(d.pipeSectionId) <= lowestThickness?.pipeSectionId + 50) )
                    ).map((d, index) => ({indexPosition: index, pipeThickness: d.pipeThickness, pipeSectionId: d.pipeSectionId, circumferenceId: d.circumferenceId})))

        setEastPoints(pipeCtx?.pipeData?.filter(d => ((Number(d.circumferenceId) >= lowestThickness?.circumferenceId - 50) && (Number(d.circumferenceId) <= lowestThickness?.circumferenceId + 50) )
                                                            && ((Number(d.pipeSectionId) >= lowestThickness?.pipeSectionId) && (Number(d.pipeSectionId) <= lowestThickness?.pipeSectionId + 100) )
                    ).map((d, index) => ({indexPosition: index, pipeThickness: d.pipeThickness, pipeSectionId: d.pipeSectionId, circumferenceId: d.circumferenceId})))

        setWestPoints(pipeCtx?.pipeData?.filter(d => ((Number(d.circumferenceId) >= lowestThickness?.circumferenceId - 50) && (Number(d.circumferenceId) <= lowestThickness?.circumferenceId + 50) )
                                                            && ((Number(d.pipeSectionId) >= lowestThickness?.pipeSectionId - 100) && (Number(d.pipeSectionId) <= lowestThickness?.pipeSectionId) )
                    ).map((d, index) => ({indexPosition: index, pipeThickness: d.pipeThickness, pipeSectionId: d.pipeSectionId, circumferenceId: d.circumferenceId})))
      
    }
    }, [pipeCtx?.pipeData, direction]);

    useEffect(() => {
        
        // console.log('northPoints', northPoints)
        // console.log('southPoints', southPoints)
        // console.log('eastPoints', eastPoints)
        // console.log('westPoints', westPoints)

        let points; 

        switch(direction) {
            case LABEL.direction.n:
                points = northPoints;
                break;
            case LABEL.direction.s:
                points = southPoints;
                break;
            case LABEL.direction.e:
                points = eastPoints;
                break;
            case LABEL.direction.w:
                points = westPoints;
                break;
            default:
                break;
        }

        const indexPositions = points.map(point => point.indexPosition);
        const pipeThicknessValues = points.map(point => point.pipeThickness);
        setSlope(calculateSlope(indexPositions, pipeThicknessValues).toFixed(3));
        // setSlope(prevSlope => ({...prevSlope, [direction]: calculateSlope(indexPositions, pipeThicknessValues).toFixed(3)}));

        const linearRegressionPlot = Plot.plot({
            grid: true,
            marks: [
              Plot.dot(points, {x: "indexPosition", y: "pipeThickness"}),
              Plot.linearRegressionY(points, {x: "indexPosition", y: "pipeThickness", stroke: "red"}),
            ],
            x: { label: "Index"},
            y: { label: "Pipe Thickness (mm)"},
          });

        plotRef.current.append(linearRegressionPlot);

        return () => linearRegressionPlot.remove();

    }, [northPoints, southPoints, eastPoints, westPoints])

   useEffect(() => {
        localStorage.setItem(direction, slope)

        const storedSlopes = {
            north: parseFloat(localStorage.getItem('North')),
            south: parseFloat(localStorage.getItem('South')),
            east: parseFloat(localStorage.getItem('East')),
            west: parseFloat(localStorage.getItem('West')),
          };

        const minSlopeDirection = Object.keys(storedSlopes).reduce((prevDir, currDir) => {
            return storedSlopes[currDir] < storedSlopes[prevDir] ? currDir : prevDir;
        });

        setMinSlopeDirection(minSlopeDirection);
        pipeCtx.setMinSlopeDirectionHandler(minSlopeDirection)
    }, [slope]) 

    return (
        <div style={{ position: "relative", fontWeight: 'bold' }}>
            <figcaption>{`${direction} Trend: ${slope}`}</figcaption>

            <div ref={plotRef} className={direction?.toLowerCase() === minSlopeDirection ? 'strongest-decline' : ''}></div>
        
            <div style={{ position: "absolute", top: 10, right: 10 }}>
                {direction === LABEL.direction.n && <img src='./assets/icons/north.png' alt="North Icon" />}
                {direction === LABEL.direction.s && <img src='./assets/icons/south.png' alt="South Icon" />}
                {direction === LABEL.direction.e && <img src='./assets/icons/east.png' alt="East Icon" />}
                {direction === LABEL.direction.w && <img src='./assets/icons/west.png' alt="West Icon" />}
            </div>
        </div>
    );
}

export default TrendPlot;
