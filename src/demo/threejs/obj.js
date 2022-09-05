import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { Select } from "@react-three/postprocessing";

function Obj({
  mapSize,
  defaultPos,
  setIsDragging,
  floorPlane,
  children,
  ...props
}) {
  const [pos, setPos] = useState(defaultPos ? defaultPos : [0, 0, 0]);
  const [isActive, setActive] = useState(false);
  let planeIntersectPoint = new THREE.Vector3();

  const [spring, api] = useSpring(() => ({
    position: pos,
    scale: 1,
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));

  const bind = useDrag(
    ({ active, timeStamp, event }) => {
      if (active) {
        event.ray.intersectPlane(floorPlane, planeIntersectPoint);
        if (
          planeIntersectPoint.x < mapSize[0] / 2 - 1 &&
          planeIntersectPoint.x > -mapSize[0] / 2 + 1 &&
          planeIntersectPoint.z < mapSize[1] / 2 - 1 &&
          planeIntersectPoint.z > -mapSize[1] / 2 + 1
        ) {
          setPos([planeIntersectPoint.x, defaultPos[1], planeIntersectPoint.z]);
        }
      }
      setIsDragging(active);
      api.start({
        position: pos,
        scale: active ? 1.2 : 1,
      });
      return timeStamp;
    },
    { delay: true }
  );

  const handleRotate = () => {
    // console.log(rotation.getValue());
  };

  return (
    <Select enabled={isActive}>
      <animated.mesh
        {...spring}
        {...bind()}
        {...props}
        onClick={(e) => {
          props.onClick(e);
          setActive(true);
          handleRotate();
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
