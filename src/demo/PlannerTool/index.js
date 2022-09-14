import { Physics } from "@react-three/cannon";
import { OrbitControls, Sky, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { nanoid } from "nanoid";
import { useState } from "react";
import ActionMenu from "./ActionMenu";
import AssetMenu from "./AssetMenu";
import Ground from "./Ground";
import Model from "./Model";
import { useInterval } from "../../hooks/useInterval";
import Grass from "../../images/grass.jpg";
import * as THREE from "three";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";

const CityPlannerTool = () => {
  const [models, setModels] = useState(
    JSON.parse(localStorage.getItem("world")) || []
  );
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const [spawningModel, setSpawningModel] = useState("");
  const [currentPos, setCurrentPos] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showMapGrid, setShowMapGrid] = useState(false);

  useInterval(() => {
    localStorage.setItem("world", JSON.stringify(models));
  }, 5000);

  const toggleMapGrid = () => setShowMapGrid(!showMapGrid);

  const addModel = (x, y, z) => {
    setModels([
      ...models,
      {
        pos: [x, y, z],
        key: nanoid(),
        texture: spawningModel,
      },
    ]);
  };

  const removeModel = () => {
    const filteredModel = models.filter((model) => {
      const [_x, _y, _z] = model.pos;
      return (
        _x !== currentPos[0] || _y !== currentPos[1] || _z !== currentPos[2]
      );
    });
    setModels(filteredModel);
    setCurrentPos([]);
  };

  const renderModels = () => {
    return models.map((model) => (
      <Model
        key={model.key}
        floorPlane={floorPlane}
        setIsDragging={setIsDragging}
        setCurrentPos={setCurrentPos}
        meshTexture={model.texture}
        position={model.pos}
      />
    ));
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
      }}
    >
      <AssetMenu setSpawningModel={setSpawningModel} addModel={addModel} />
      <ActionMenu
        toggleMapGrid={toggleMapGrid}
        currentPos={currentPos}
        removeModel={removeModel}
      />

      <Canvas
        camera={{ position: [20, 20, 20] }}
        style={{ backgroundColor: "black" }}
        shadows
      >
        <OrbitControls enabled={!isDragging} maxPolarAngle={Math.PI / 2.2} />
        <ambientLight intensity={0.25} />
        <pointLight castShadow intensity={0.7} position={[100, 100, 100]} />
        <Stars
          radius={300}
          depth={60}
          count={2000}
          fade
          factor={7}
          saturation={0}
        />
        <Physics gravity={[0, -30, 0]}>
          <Selection>
            <EffectComposer multisampling={8} autoClear={false}>
              <Outline
                blur
                visibleEdgeColor="yellow"
                edgeStrength={10}
                width={2200}
              />
            </EffectComposer>
            {renderModels()}
          </Selection>
          <Ground
            showMapGrid={showMapGrid}
            texture={Grass}
            position={[0, 0.5, 0]}
            spawningModel={spawningModel}
          />
        </Physics>
      </Canvas>
    </div>
  );
};

export default CityPlannerTool;
