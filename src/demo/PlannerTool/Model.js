import { useBox, useSphere } from "@react-three/cannon";
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
  setCurrentModel,
  rotateValue,
  setIsDragging,
  currentModel,
  scaleValue,
  rotation,
  scale,
  setRotate,
  setScale,
  floorPlane,
  modelId,
  models,
  setModels,
  isPreview,
  handleSaveWorld,
}) => {
  const { scene } = useGLTF(meshTexture);
  const [pos, setPos] = useState(position ? position : [0, 0, 0]);
  const [axesHelper, setAxesHelper] = useState(false);
  const copiedScene = useMemo(() => scene.clone(), [scene]);
  const [modelScale, setModelScale] = useState(scale);
  const [modelRotate, setModelRotate] = useState(rotation);

  let planeIntersectPoint = new THREE.Vector3();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Static",
    position,
    rotation: modelRotate,
  }));

  useEffect(() => {
    models.map((model) => {
      if (model.key === modelId) {
        model.pos = pos;
        model.rotation = modelRotate;
        model.scale = modelScale;
      }
    });
    setModels(models);
  }, [pos, modelScale, modelRotate]);

  useEffect(() => {
    ref.current.scale.x = scale[0];
    ref.current.scale.y = scale[1];
    ref.current.scale.z = scale[2];
  }, [scale]);

  useEffect(() => {
    if (modelId === currentModel) {
      const rotateAngle = [0, (rotateValue * Math.PI) / 180, 0];
      api.rotation.set(rotateAngle[0], rotateAngle[1], rotateAngle[2]);
      setModelRotate(rotateAngle);
    }
  }, [rotateValue, currentModel]);

  useEffect(() => {
    if (modelId === currentModel) {
      ref.current.scale.x = scaleValue;
      ref.current.scale.y = scaleValue;
      ref.current.scale.z = scaleValue;
      setModelScale([scaleValue, scaleValue, scaleValue]);
    }
  }, [scaleValue, currentModel]);

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
      {isPreview ? (
        <mesh castShadow>
          <primitive object={copiedScene} />
          <meshStandardMaterial
            attach="material"
            metalness={0.4}
            roughness={0.7}
          />
        </mesh>
      ) : (
        <mesh
          {...bind()}
          ref={ref}
          onClick={() => {
            setRotate(modelRotate[1] / (Math.PI / 180));
            setScale(modelScale[0]);
            setAxesHelper(true);
            setCurrentModel(modelId);
          }}
          onPointerMissed={() => {
            setAxesHelper(false);
            setCurrentModel(null);
            handleSaveWorld();
          }}
          castShadow
        >
          <primitive object={copiedScene} />
          {axesHelper && <axesHelper args={[3, 3, 3]} />}
          <meshStandardMaterial
            attach="material"
            metalness={0.4}
            roughness={0.7}
          />
        </mesh>
      )}
    </Select>
  );
};

export default Model;
