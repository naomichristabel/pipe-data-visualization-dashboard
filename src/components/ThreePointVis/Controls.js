import * as React from 'react';
import { extend, useThree, useFrame } from 'react-three-fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';

// extend THREE to include TrackballControls
extend({ TrackballControls });

// key code constants
const ALT_KEY = 18;
const CTRL_KEY = 17;
const CMD_KEY = 91;
const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const ARROW_UP = 38;
const ARROW_DOWN = 40;

const Controls = ({}, ref) => {
  const controls = React.useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    // update the view as the vis is interacted with
    controls.current.update();
  });

  React.useImperativeHandle(ref, () => ({
    resetCamera: () => {
      // reset look-at (target) and camera position
      controls.current.target.set(0, 0, 0);
      camera.position.set(0, 0, 50);

      // needed for trackball controls, reset the up vector
      camera.up.set(
        controls.current.up0.x,
        controls.current.up0.y,
        controls.current.up0.z
      );
    },
  }));


  return (
    <trackballControls
      ref={controls}
      args={[camera, gl.domElement]}
      dynamicDampingFactor={0.1}
      keys={[
        ALT_KEY, // orbit
        CTRL_KEY, // zoom
        CMD_KEY, // pan
      ]}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
        MIDDLE: THREE.MOUSE.ZOOM,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
    />
    // <orbitControls 
    //     ref={controls}
    //     args={[camera, gl.domElement]}
    //     dynamicDampingFactor={0.1}
    //     keys={{
    //         LEFT: ARROW_LEFT,
	//         UP: ARROW_UP,
	//         RIGHT: ARROW_RIGHT, 
	//         BOTTOM: ARROW_DOWN
    //     }}
    //     mouseButtons={{
    //         LEFT: THREE.MOUSE.ROTATE, 
    //         MIDDLE: THREE.MOUSE.DOLLY,
    //         RIGHT: THREE.MOUSE.PAN,
    //     }}
    // />
  );
};

export default React.forwardRef(Controls);
