import { useBox } from "@react-three/cannon";
import { useState } from "react";
import * as textures from "./CubeTextures";

const Cube = ({ position, addCube, texture, removeCube, usingCube }) => {
  const [hover, setHover] = useState(null);
  const color = texture === "glass" ? "#ebf2ff" : "white";
  const [ref] = useBox(() => ({
    type: "Static",
    position,
  }));

  return (
    <mesh
      ref={ref}
      castShadow
      onPointerMove={(e) => {
        e.stopPropagation();
        setHover(Math.floor(e.faceIndex / 2));
      }}
      onPointerOut={() => {
        setHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex / 2);
        const { x, y, z } = ref.current.position;
        if (usingCube === "axe") {
          removeCube(x, y, z);
        } else {
          if (clickedFace === 0) {
            addCube(x + 1, y, z);
            return;
          }
          if (clickedFace === 1) {
            addCube(x - 1, y, z);
            return;
          }
          if (clickedFace === 2) {
            addCube(x, y + 1, z);
            return;
          }
          if (clickedFace === 3) {
            addCube(x, y - 1, z);
            return;
          }
          if (clickedFace === 4) {
            addCube(x, y, z + 1);
            return;
          }
          if (clickedFace === 5) {
            addCube(x, y, z - 1);
            return;
          }
        }
      }}
    >
      <meshStandardMaterial
        attach="material"
        map={textures[texture]}
        color={hover != null ? "gray" : color}
        opacity={texture === "glass" ? 0.7 : 1}
        transparent={true}
      />
      <boxBufferGeometry attach="geometry" />
    </mesh>
  );
};

export default Cube;
