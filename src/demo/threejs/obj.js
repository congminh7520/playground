import React, { useState } from "react";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";

function Obj({
  mapSize,
  defaultPos,
  setIsDragging,
  floorPlane,
  children,
  isChoose,
  ...props
}) {
  const [pos, setPos] = useState(defaultPos ? defaultPos : [0, 1, 0]);
  const { size } = useThree();
  let planeIntersectPoint = new THREE.Vector3();

  const [spring, api] = useSpring(() => ({
    mass: 1,
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

  return (
    <Selection>
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline blur visibleEdgeColor="white" edgeStrength={10} width={2000} />
      </EffectComposer>
      <Select enabled={isChoose}>
        <animated.mesh {...spring} {...bind()} {...props} castShadow>
          {children}
        </animated.mesh>
      </Select>
    </Selection>
  );
}

export default Obj;
