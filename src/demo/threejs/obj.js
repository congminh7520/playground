import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { Select } from "@react-three/postprocessing";

function Obj({
  mapSize,
  position,
  rotation,
  setIsDragging,
  floorPlane,
  children,
  isRotate,
  isAllowRotate,
  handleAddModel,
  model,
  ...props
}) {
  const mesh = useRef();
  const [pos, setPos] = useState(position ? position : [0, 0, 0]);
  const [isActive, setActive] = useState(false);
  let planeIntersectPoint = new THREE.Vector3();

  useEffect(() => {
    handleAddModel({ ...mesh.current, ...model });
  }, [mesh]);

  const [spring, api] = useSpring(() => ({
    position: pos,
    scale: 1,
    rotation: rotation || [0, 0, 0],
    config: { friction: 10 },
  }));

  const bind = useDrag(({ active, timeStamp, event }) => {
    if (active) {
      event.ray.intersectPlane(floorPlane, planeIntersectPoint);
      if (
        planeIntersectPoint.x < mapSize[0] / 2 - 1 &&
        planeIntersectPoint.x > -mapSize[0] / 2 + 1 &&
        planeIntersectPoint.z < mapSize[1] / 2 - 1 &&
        planeIntersectPoint.z > -mapSize[1] / 2 + 1
      ) {
        setPos([planeIntersectPoint.x, position[1], planeIntersectPoint.z]);
      }
    }
    setIsDragging(active);
    api.start(
      isRotate
        ? {
            rotation: [0, mesh.current.rotation.y + 0.1, 0],
            scale: active ? 1.2 : 1,
          }
        : { position: pos, scale: active ? 1.2 : 1 }
    );
    return timeStamp;
  });

  return (
    <Select enabled={isActive}>
      <animated.mesh
        ref={mesh}
        {...spring}
        {...bind()}
        {...props}
        onClick={(e) => {
          props.onClick(e);
          setActive(true);
        }}
        onPointerMissed={() => {
          props.onPointerMissed();
          setActive(false);
        }}
        castShadow
      >
        {children}
      </animated.mesh>
    </Select>
  );
}

export default Obj;
