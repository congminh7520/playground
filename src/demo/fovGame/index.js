import { Physics } from "@react-three/cannon";
import { OrbitControls, Sky, Stars, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { useKeyboardInput } from "../../hooks/useKeyboardInput";
import Cube from "./Cube";
import { nanoid } from "nanoid";
import Ground from "./Ground";
import Player from "./Player";
import { useInterval } from "../../hooks/useInterval";
import { message } from "antd";

const FovGame = () => {
  const [cubes, setCubes] = useState(
    JSON.parse(localStorage.getItem("world")) || []
  );
  const { texture } = useKeyboardInput();

  useInterval(() => {
    localStorage.setItem("world", JSON.stringify(cubes));
  }, 5000);

  useEffect(() => {
    message.info(`Spawning ${texture}`);
  }, [texture]);

  const addCube = (x, y, z) =>
    setCubes([...cubes, { key: nanoid(), pos: [x, y, z], texture }]);

  const removeCube = (x, y, z) => {
    const filteredCubes = cubes.filter((cube) => {
      const [_x, _y, _z] = cube.pos;
      return _x !== x || _y !== y || _z !== z;
    });
    setCubes(filteredCubes);
  };

  return (
    <Canvas shadows>
      <Stats />
      <Stars
        radius={300}
        depth={60}
        count={2000}
        fade
        factor={7}
        saturation={0}
      />
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.25} />
      <pointLight castShadow intensity={0.7} position={[100, 100, 100]} />
      <Physics gravity={[0, -30, 0]}>
        <Ground
          cubeTexture={texture}
          addCube={addCube}
          position={[0, 0.5, 0]}
        />
        <Player position={[0, 2, 10]} />
        {cubes.map((cube) => (
          <Cube
            addCube={addCube}
            removeCube={removeCube}
            usingCube={texture}
            key={cube.key}
            position={cube.pos}
            texture={cube.texture}
          />
        ))}
      </Physics>
    </Canvas>
  );
};

export default FovGame;
