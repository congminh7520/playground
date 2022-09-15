import { useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { useState } from "react";
import { useMemo } from "react";
import * as THREE from "three";
import { useDrag } from "@use-gesture/react";
import { Select } from "@react-three/postprocessing";
import { useEffect } from "react";

const Model = ({
  position,
  meshTexture,
  setCurrentPos,
  rotateValue,
  setIsDragging,
  currentPos,
  scaleValue,
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

  useEffect(() => {
    const { x, y, z } = ref.current.position;
    if (x === currentPos[0] && y === currentPos[1] && z === currentPos[2])
      api.rotation.set(0, (rotateValue * Math.PI) / 180, 0);
  }, [rotateValue, currentPos]);

  useEffect(() => {
    const { x, y, z } = ref.current.position;
    if (x === currentPos[0] && y === currentPos[1] && z === currentPos[2]){
      ref.current.scale.x = scaleValue
      ref.current.scale.y = scaleValue
      ref.current.scale.z = scaleValue
    }
  }, [scaleValue, currentPos]);

  const bind = useDrag(({ active, timeStamp, event }) => {
    if (active) {
      event.ray.intersectPlane(floorPlane, planeIntersectPoint);
      if (
        planeIntersectPoint.x < 40 / 2 - 1 &&
        planeIntersectPoint.x > -40 / 2 + 1 &&
        planeIntersectPoint.z < 40 / 2 - 1 &&
        planeIntersectPoint.z > -40 / 2 + 1
      ) {
        setPos([
          planeIntersectPoint.x,
          ref.current.position.y,
          planeIntersectPoint.z,
        ]);
      }
    }
    setIsDragging(active);
    api.position.set(Math.ceil(pos[0]), pos[1], Math.ceil(pos[2]));
    return timeStamp;
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
          attach="material"
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
    </Select>
  );
};

export default Model;
