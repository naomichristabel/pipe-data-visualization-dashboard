import React from 'react';
import * as THREE from 'three';

const XYPlane = ({ width, height, lowestThicknessPoint }) => {
  // Create geometry
  const geometry = new THREE.PlaneGeometry(width, height);

  // Create material
  const material = new THREE.MeshBasicMaterial({ color: 0xdddddd, opacity: 0.1, transparent: true, side: THREE.DoubleSide });

  return (
    <mesh geometry={geometry} material={material} rotation={[0, 0, 0]} position={[1650, 0, lowestThicknessPoint.z]} />
  );
};

export default XYPlane;
