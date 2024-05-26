import React from 'react';
import * as THREE from 'three';

const XZPlane = ({ width, height, lowestThicknessPoint }) => {
  // Create geometry
  const geometry = new THREE.PlaneGeometry(width, height);

  // Create material
  const material = new THREE.MeshBasicMaterial({ color: 0xdddddd, opacity: 0.2, transparent: true, side: THREE.DoubleSide });

  return (
    <mesh geometry={geometry} material={material} rotation={[Math.PI / 2, 0, 0]} position={[50, lowestThicknessPoint.y, 0]} />
  );
};

export default XZPlane;
