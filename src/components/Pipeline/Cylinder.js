// // RING EXTRUDED TO FORM CYLINDER - SLICED INTO 4 CYLINDERS AT POINT OF LOWEST THICKNESS
import React, { useEffect, useRef, useState } from "react";
import { useLoader } from "react-three-fiber";
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import * as THREE from 'three';
import { COLOURS, PIPE_CONSTANTS } from "../../utils/Contants.js";

const drawCircle = (centerX,centerY,radius,segments,isCircle,isSemiCircle) => {

const shape = new THREE.Shape();

// Calculate the angle increment based on the number of segments
let angleIncrement;
if(isCircle) {
  angleIncrement = (Math.PI * 2) / segments;
}
else if(isSemiCircle) {
  angleIncrement = (Math.PI) / segments; // This will draw a semi-circle
}

// Add points to the shape to approximate the circle
for (let i = 0; i < segments; i++) {
  const angle = i * angleIncrement;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  if (i === 0) {
    shape.moveTo(x, y);
  } else {
    shape.lineTo(x, y);
  }
}
shape.closePath();

return shape;
}

const Cylinder = ({ height, lowestThicknessPoint, showPipe }) => {
  const [isCircle, setIsCircle] = useState(true);
  const [isSemiCircle, setIsSemiCircle] = useState(false);

  useEffect(() => {
    if(showPipe?.full || showPipe?.half?.west || showPipe?.half?.east) {
      setIsCircle(true)
      setIsSemiCircle(false)
    } else if(showPipe?.half?.north || showPipe?.half?.south) {
      setIsCircle(false)
      setIsSemiCircle(true)
    }
  }, [showPipe]);

  const fullRef = useRef();  //Full Pipe

  const leftRef = useRef();    // West Pipe
  const rightRef = useRef();   // East Pipe
  const backRef = useRef();    // North Pipe
  const frontRef = useRef();   // South Pipe

  const topLeftRef = useRef();    // North West Pipe
  const bottomLeftRef = useRef(); // South West Pipe
  const topRightRef = useRef();   // North East Pipe
  const bottomRightRef = useRef(); // South East Pipe

  const centerX = 0; // Assuming the cylinder's center is at (0, 0)
  const centerY = 0;

  const outerShape = drawCircle(centerX, centerY, PIPE_CONSTANTS.pipeOuterRadius, 128, isCircle, isSemiCircle);
  const innerShape = drawCircle(centerX, centerY, PIPE_CONSTANTS.pipeInnerRadius, 64, isCircle, isSemiCircle);
  outerShape.holes.push(innerShape); // Push inner circle as a hole to the outer circle

  const extrudeSettings = {
    steps: 1,
    depth: height,
    bevelEnabled: false
  };

  const geometry = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);

  // FOR TRENDLINE PLOTS: N, E, W, S portions of the pipe to be shown

  // Position to slice the cylinder 
  const xPos = lowestThicknessPoint.x;
  const yPos = lowestThicknessPoint.y;
  const zPos = lowestThicknessPoint.z;

  // Calculate the left and right lengths for each portion
  const leftLength = xPos;
  const rightLength = height - xPos;

  // Copy and slice the geometry into four portions
  const leftGeometry = geometry.clone().scale(1, 1, leftLength / height).translate(0, 0, -rightLength / 10000);
  const rightGeometry = geometry.clone().scale(1, 1, rightLength / height).translate(0, 0, leftLength);

  const backGeometry = geometry.clone().translate(0, -zPos, 0);
  const frontGeometry = geometry.clone().translate(0, zPos, 0);

       useEffect(() => {
    // Rotate the cylinder to lie flat on the ground and face the correct way
      if(showPipe.full && fullRef) {
        fullRef.current.rotation.y = Math.PI / 2;
      }

      if((showPipe.half.west && leftRef) || (showPipe.half.east && rightRef)) {
        leftRef.current.rotation.y = Math.PI / 2;
        rightRef.current.rotation.y = Math.PI / 2;
      }

      if(showPipe.half.north && backRef) {
        backRef.current.rotation.x = Math.PI / 2; 
        backRef.current.rotation.y = Math.PI / 2;
        backRef.current.rotation.z = Math.PI; 
      }

      if(showPipe.half.south && frontRef) {
        frontRef.current.rotation.x = Math.PI / 2; 
        frontRef.current.rotation.y = Math.PI / 2;
        frontRef.current.rotation.z = 2 * Math.PI; 
      }

      //Show both front & back if it is either N or S
      // if((showPipe.half.north && backRef) || (showPipe.half.south && frontRef)) {
      //   backRef.current.rotation.x = Math.PI / 2; 
      //   backRef.current.rotation.y = Math.PI / 2;
      //   backRef.current.rotation.z = Math.PI; 

      //   frontRef.current.rotation.x = Math.PI / 2; 
      //   frontRef.current.rotation.y = Math.PI / 2;
      //   frontRef.current.rotation.z = 2 * Math.PI; 
      // }
   }, [showPipe]);

  return (
    <>
      {showPipe.full && 
      <mesh geometry={geometry} ref={fullRef}>
        <meshStandardMaterial attach="material" color={COLOURS.mediumGrey} transparent={false} opacity={1}/>
      </mesh>
      }

      {(showPipe?.half.east || showPipe?.half.west) && 
        <>
          {/* West / Left Portion of the pipe */}
          <mesh geometry={leftGeometry} ref={leftRef}>
            <meshStandardMaterial attach="material" color={showPipe?.half.west ? COLOURS.mediumGrey : COLOURS.darkGrey} transparent={false} opacity={1}/>
          </mesh>

          {/* East / Right Portion of the pipe */}
          <mesh geometry={rightGeometry} ref={rightRef}>
            <meshStandardMaterial attach="material" color={showPipe?.half.east ? COLOURS.mediumGrey : COLOURS.darkGrey} transparent={false} opacity={1} />
          </mesh>
        </>
      }

      {showPipe?.half.north && 
        <>
          {/* North / Back Portion of the pipe */}
          <mesh geometry={backGeometry} ref={backRef}>
            <meshStandardMaterial attach="material" color={COLOURS.mediumGrey} transparent={false} opacity={1}/>
          </mesh>
        </>
      }

      {showPipe?.half.south && 
        <>
          {/* South / Front Portion of the pipe */}
          <mesh geometry={frontGeometry} ref={frontRef}>
            <meshStandardMaterial attach="material" color={COLOURS.mediumGrey} transparent={false} opacity={1}/>
          </mesh>
        </>
      }

      {/* Show both front & back if it is either N or S */}
      {/* {(showPipe?.half.north || showPipe?.half.south) && 
        <> */}
          {/* North / Back Portion of the pipe */}
          {/* <mesh geometry={backGeometry} ref={backRef}>
            <meshStandardMaterial attach="material" color={showPipe?.half.north ? COLOURS.mediumGrey : COLOURS.darkGrey} transparent={false} opacity={1}/>
          </mesh> */}

          {/* South / Front Portion of the pipe */}
          {/* <mesh geometry={frontGeometry} ref={frontRef}>
            <meshStandardMaterial attach="material" color={showPipe?.half.south ? COLOURS.mediumGrey : COLOURS.darkGrey} transparent={false} opacity={1}/>
          </mesh>
        </>
      } */}

        
    </>
  );
};

export default Cylinder;

// ---------------------------------------------------------------------

// // RING EXTRUDED TO FORM CYLINDER - TEXTURE IS ALSO BEING EXTRUDED
// import React, { useEffect, useRef } from "react";
// import { useLoader } from "react-three-fiber";
// import { TextureLoader } from 'three/src/loaders/TextureLoader'
// import * as THREE from 'three';
// import { COLOURS, PIPE_CONSTANTS } from "../../utils/Contants.js";


// const drawCircle = (centerX,centerY,radius,segments) => {

// const shape = new THREE.Shape();

// // Calculate the angle increment based on the number of segments
// const angleIncrement = (Math.PI * 2) / segments;

// // Add points to the shape to approximate the circle
// for (let i = 0; i < segments; i++) {
//   const angle = i * angleIncrement;
//   const x = centerX + radius * Math.cos(angle);
//   const y = centerY + radius * Math.sin(angle);
//   if (i === 0) {
//     shape.moveTo(x, y);
//   } else {
//     shape.lineTo(x, y);
//   }
// }
// shape.closePath();

// return shape;
// }

// const Cylinder = ({ height }) => {
//   const outerShape = drawCircle(0, 0, PIPE_CONSTANTS.pipeOuterRadius, 128);
//   const innerShape = drawCircle(0, 0, PIPE_CONSTANTS.pipeInnerRadius, 64);
//   outerShape.holes.push(innerShape); // Push inner circle as a hole to the outer circle

//   const extrudeSettings = {
//     steps: 1,
//     depth: height,
//     bevelEnabled: false
//   };

//   const geometry = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);

//     const myref = useRef();

//     const colorMap = useLoader(TextureLoader, 'textures/Metal041A_1K-PNG_Color.png')

//      useEffect(() => {
//     // Rotate the cylinder to lie flat on the ground and face the other way
//       // myref.current.rotation.x = Math.PI / 2 ; // -90 degrees in radians
//       myref.current.rotation.y = Math.PI / 2;
//       // myref.current.rotation.z = Math.PI / 2;
//    }, []);
   

//   return (
    
//       <mesh ref={myref}>
//         <primitive attach="geometry" object={geometry} />
//         <meshStandardMaterial attach="material" color={COLOURS.mediumGrey} transparent={false} opacity={1} map={colorMap} />
//         {/* <meshStandardMaterial attach="material" transparent opacity={0.5} map={colorMap} /> */}
//       </mesh>
    
//   );
// };

// export default Cylinder;

// ----------------------------------------------------------------------

// SOLID CYLINDER
// import React, { useEffect, useRef } from "react";
// import { Canvas, useFrame, useLoader } from "react-three-fiber";
// import { TextureLoader } from 'three/src/loaders/TextureLoader'

// const Cylinder = () => {

//    const myref = useRef();
//    const colorMap = useLoader(TextureLoader, 'textures/Metal022_1K-PNG_Color.png')

//    useEffect(() => {
//     // Rotate the cylinder to lie flat on the ground and face the other way
//       myref.current.rotation.x = Math.PI / 2 ; // -90 degrees in radians
//       myref.current.rotation.z = Math.PI /2;
//    }, []);
   

//    return (
//       <mesh ref={myref}>
//          <cylinderBufferGeometry attach="geometry" args={[5, 5, 40, 32]} />
//          <meshBasicMaterial attach="material" transparent opacity={0.4} map={colorMap} />
//       </mesh>
//    );
// }

// export default Cylinder

// -------------------------------------------------------------------

// TWO CYLINDER GEOMETRIES - FOR A HOLLOW CYLINDER - THIS FLICKERS
// import React from 'react';
// import { Canvas } from 'react-three-fiber';
// import * as THREE from 'three';

// const Cylinder = () => {
//   const outerRadius = 2; // Outer radius of the cylinder
//   const innerRadius = 1; // Inner radius of the cylinder
//   const height = 2; // Height of the cylinder
//   const radialSegments = 64; // Number of radial segments

//   // Create material for outer cylinder
//   const outerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

//   // Create material for inner cylinder (black)
//   const innerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

//   // Create outer cylinder geometry
//   const outerGeometry = new THREE.CylinderBufferGeometry(outerRadius, outerRadius, height, radialSegments);

//   // Create inner cylinder geometry
//   const innerGeometry = new THREE.CylinderBufferGeometry(innerRadius, innerRadius, height, radialSegments);

//   // Create mesh for outer cylinder
//   const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);

//   // Create mesh for inner cylinder
//   const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);

//   // Set position and rotation for inner cylinder
//   innerMesh.position.set(0, 0, 0);
//   innerMesh.rotation.set(Math.PI, 0, 0); // Flip inner cylinder

//   // Create group to hold both cylinder meshes
//   const group = new THREE.Group();
//   group.add(outerMesh);
//   group.add(innerMesh);

//   return (
   
//       <group>
//         <primitive object={group} />
//       </group>
   
//   );
// };

// export default Cylinder;
