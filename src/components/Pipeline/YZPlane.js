import React from 'react';
import * as THREE from 'three';

const YZPlane = ({ width, height, lowestThicknessPoint }) => {
  // Create geometry
  const geometry = new THREE.PlaneGeometry(width, height);

  // Create material
  const material = new THREE.MeshBasicMaterial({ color: 0xdddddd, opacity: 0.1, transparent: true, side: THREE.DoubleSide });

  return (
    <mesh geometry={geometry} material={material} rotation={[0, Math.PI / 2, 0]} position={[lowestThicknessPoint.x, 0, 0]} />
  );
};

export default YZPlane;
