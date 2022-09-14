import { usePlane } from "@react-three/cannon";
import { Plane } from "@react-three/drei";
import { useMemo } from "react";
import {
  LinearMipMapLinearFilter,
  NearestFilter,
  RepeatWrapping,
  TextureLoader,
} from "three";

const Ground = ({ texture, showMapGrid, ...props }) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));

  const groundTexture = useMemo(() => {
    const t = new TextureLoader().load(texture);
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
    t.repeat.set(40, 40);
    return t;
  }, []);

  groundTexture.magFilter = NearestFilter;
  groundTexture.minFilter = LinearMipMapLinearFilter;
  groundTexture.wrapS = RepeatWrapping;
  groundTexture.wrapT = RepeatWrapping;
  groundTexture.repeat.set(40, 40);

  const XYPlane = () => (
    <Plane
      args={[40, 40, 40, 40]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.5, 0]}
    >
      <meshStandardMaterial attach="material" color="pink" wireframe />
    </Plane>
  );

  return (
    <group>
      <mesh ref={ref} receiveShadow>
        <planeBufferGeometry attach="geometry" args={[40, 40]} />
        <meshStandardMaterial map={groundTexture} attach="material" />
      </mesh>
      {showMapGrid && <XYPlane />}
    </group>
  );
};

export default Ground;
