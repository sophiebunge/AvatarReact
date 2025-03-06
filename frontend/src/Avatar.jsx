import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Avatar = ({ url }) => {
  const avatarRef = useRef();

  const { scene } = useGLTF(url);

  // Adjust Avatar Position
  useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.scale.set(1.5, 1.5, 1.5); 
      avatarRef.current.position.set(0, -0.7, 0); 
    }
  }, []);
  

  return <primitive ref={avatarRef} object={scene} />;
};

const AvatarViewer = ({ avatarUrl }) => {
  return (
    <Canvas camera={{ position: [0, 1, 3] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <Avatar url={avatarUrl} />
      <OrbitControls />
    </Canvas>
  );
};

export default AvatarViewer;
