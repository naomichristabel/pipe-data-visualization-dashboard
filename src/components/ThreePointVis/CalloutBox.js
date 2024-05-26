import { useRef } from 'react';
import * as THREE from 'three';
import { COLOURS } from '../../utils/Contants';

function CalloutBox({ position, text }) {
    const ref = useRef();
  
    // Function to create a text sprite
    const createTextSprite = (text) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const fontSize = 500; // Adjust font size as needed
      context.font = `${fontSize}px Arial`;
      const textMetrics = context.measureText(text);
      canvas.width = textMetrics.width;
      canvas.height = fontSize;
      context.font = `${fontSize}px Arial`;
      context.fillStyle = 'white';
      context.fillText(text, 0, fontSize);
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: COLOURS.lightGrey }); // Set emissive to black to remove glow
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(canvas.width / 150, canvas.height / 150, 1);
      return sprite;
    };

    // Function to create an arrow geometry 
    const createArrowGeometry = () => {
      const geometry = new THREE.ConeGeometry(1, 5, 4); // Adjust cone dimensions as needed
      const material = new THREE.MeshBasicMaterial({ color: COLOURS.mediumGrey }); // Set emissive to black to remove glow
      const arrow = new THREE.Mesh(geometry, material);
      arrow.rotation.x = Math.PI; // Rotate the arrow to point downwards
      return arrow;
    };
  
    // Add text sprite directly to the scene
    const textSprite = createTextSprite(text);
    textSprite.position.set(position.x, position.y, position.z);

    // Add arrow geometry below the text
    const arrow = createArrowGeometry();
    arrow.position.set(position.x, position.y - 5, position.z); // Adjust the position as needed

    return (
      <>
        <primitive object={textSprite} ref={ref} />
        <primitive object={arrow} />
      </>
    );
}

export default CalloutBox;
