import { useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { useState } from "react";
import { useMemo } from "react";
import * as THREE from "three";
import { useDrag } from "@use-gesture/react";
import { Select } from "@react-three/postprocessing";
import { useEffect } from "react";
import { useRef } from "react";

const Model = ({
  position,
  meshTexture,
  setCurrentPos,
  rotateValue,
  setIsDragging,
  currentPos,
  scaleValue,
  rotation,
  scale,
  setRotate,
  setScale,
  floorPlane,
  modelId,
  models,
  setModels,
  handleSaveWorld,
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
    rotation,
  }));

  const _pos = useRef(position);
  useEffect(
    () => api.position.subscribe((v) => (_pos.current = v)),
    [api.position]
  );
  const _rotation = useRef(rotation);
  useEffect(
    () =>
      api.rotation.subscribe((v) => (_rotation.current = [v[0], v[1], v[2]])),
    [api.rotation]
  );

  useEffect(() => {
    models.map((model) => {
      if (model.key === modelId) {
        model.pos = _pos.current;
        model.rotation = _rotation.current;
      }
    });
    setModels(models);
  }, [_pos.current, _rotation.current]);
  
  useEffect(() => {
    ref.current.scale.x = scale[0];
    ref.current.scale.y = scale[1];
    ref.current.scale.z = scale[2];
  }, [scale]);

  useEffect(() => {
    const { x, y, z } = ref.current.position;
    if (x === currentPos[0] && y === currentPos[1] && z === currentPos[2])
      api.rotation.set(0, (rotateValue * Math.PI) / 180, 0);
  }, [rotateValue]);

  useEffect(() => {
    const { x, y, z } = ref.current.position;
    if (x === currentPos[0] && y === currentPos[1] && z === currentPos[2]) {
      ref.current.scale.x = scaleValue;
      ref.current.scale.y = scaleValue;
      ref.current.scale.z = scaleValue;
    }
  }, [scaleValue]);

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
    } else {
      handleSaveWorld();
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
        onClick={(e) => {
          const { x, y, z } = ref.current.position;
          setAxesHelper(true);
          setCurrentPos([x, y, z]);
        }}
        onPointerMissed={() => {
          setAxesHelper(false);
          setCurrentPos([]);
          handleSaveWorld();
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
