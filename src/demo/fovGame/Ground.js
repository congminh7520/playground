import { usePlane } from "@react-three/cannon";
import { useMemo } from "react";
import {
  LinearMipMapLinearFilter,
  NearestFilter,
  RepeatWrapping,
  TextureLoader,
} from "three";
import grass from "../../images/grass.jpg";

const Ground = ({ addCube, cubeTexture, ...props }) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  const texture = useMemo(() => {
    const t = new TextureLoader().load(grass);
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
    t.repeat.set(100, 100);
    return t;
  }, []);

  texture.magFilter = NearestFilter;
  texture.minFilter = LinearMipMapLinearFilter;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(100, 100);

  return (
    <mesh
      onClick={(e) => {
        e.stopPropagation();
        const [x, y, z] = Object.values(e.point).map((coord) =>
          Math.ceil(coord)
        );
        cubeTexture !== "none" && addCube(x, y, z);
      }}
      ref={ref}
      receiveShadow
    >
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial map={texture} attach="material" />
    </mesh>
  );
};

export default Ground;
