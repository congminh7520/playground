import { useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { useState } from "react";
import { useMemo } from "react";
import * as THREE from "three";
import { useDrag } from "@use-gesture/react";
import { Select } from "@react-three/postprocessing";

const Model = ({
  position,
  meshTexture,
  setCurrentPos,
  setIsDragging,
  floorPlane,
}) => {
  const { scene } = useGLTF(meshTexture);
  const [pos, setPos] = useState(position ? position : [0, 0, 0]);
  const [axesHelper, setAxesHelper] = useState(false);
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  let planeIntersectPoint = new THREE.Vector3();

  const [ref, api] = useBox(() => ({
    mass: 1,
    type: "Static",
    position,
  }));

  const bind = useDrag(({ active, event }) => {
    if (active) {
      event.ray.intersectPlane(floorPlane, planeIntersectPoint);
      if (
        planeIntersectPoint.x < 40 / 2 - 1 &&
        planeIntersectPoint.x > -40 / 2 + 1 &&
        planeIntersectPoint.z < 40 / 2 - 1 &&
        planeIntersectPoint.z > -40 / 2 + 1
      ) {
        setPos([planeIntersectPoint.x, position[1], planeIntersectPoint.z]);
      }
    }
    setIsDragging(active);
    api.position.set(Math.ceil(pos[0]), Math.ceil(pos[1]), Math.ceil(pos[2]));
  });

  return (
    <Select enabled={axesHelper}>
      <mesh
        {...bind()}
        ref={ref}
        onClick={() => {
          const { x, y, z } = ref.current.position;
          setAxesHelper(true);
          setCurrentPos([x, y, z]);
        }}
        onPointerMissed={() => {
          setAxesHelper(false);
          setCurrentPos([]);
        }}
        castShadow
      >
        <primitive object={copiedScene} />
        {axesHelper && <axesHelper args={[2, 2, 2]} />}
        <meshStandardMaterial
          wireframe={true}
          metalness={0.7}
          roughness={0.7}
        />
      </mesh>
    </Select>
  );
};

export default Model;
