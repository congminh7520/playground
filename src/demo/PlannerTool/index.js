import { Physics } from "@react-three/cannon";
import { OrbitControls, Sky, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { nanoid } from "nanoid";
import { useState } from "react";
import ActionMenu from "./ActionMenu";
import AssetMenu from "./AssetMenu";
import Ground from "./Ground";
import Model from "./Model";
import { CloseOutlined } from "@ant-design/icons";
import Crosshair from "./Crosshair";
import Grass from "../../images/grass.jpg";
import * as THREE from "three";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import { useEffect } from "react";
import Player from "./Player";

const CityPlannerTool = () => {
  const [models, setModels] = useState(
    JSON.parse(localStorage.getItem("world")) || []
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const [rotateValue, setRotateValue] = useState(0);
  const [scaleValue, setScaleValue] = useState(1);
  const [spawningModel, setSpawningModel] = useState("");
  const [currentModel, setCurrentModel] = useState();
  const [isPreview, setIsPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMapGrid, setShowMapGrid] = useState(false);

  useEffect(() => {
    handleSaveWorld();
  }, [models]);

  const handleSaveWorld = () => {
    localStorage.setItem("world", JSON.stringify(models));
  };

  const toggleMapGrid = () => setShowMapGrid(!showMapGrid);
  const togglePreview = () => setIsPreview(!isPreview);
  const addModel = (x, y, z) => {
    setModels([
      ...models,
      {
        pos: [x, y, z],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        key: nanoid(),
        texture: spawningModel,
      },
    ]);
  };

  const removeModel = () => {
    const filteredModel = models.filter((model) => model.key !== currentModel);
    setModels(filteredModel);
    setCurrentModel(null);
  };

  const renderModels = () => {
    return models.map((model) => (
      <Model
        key={model.key}
        isPreview={isPreview}
        handleSaveWorld={handleSaveWorld}
        setModels={setModels}
        modelId={model.key}
        models={models}
        setRotate={setRotateValue}
        setScale={setScaleValue}
        rotateValue={rotateValue}
        floorPlane={floorPlane}
        currentModel={currentModel}
        scaleValue={scaleValue}
        setIsDragging={setIsDragging}
        setCurrentModel={setCurrentModel}
        meshTexture={model.texture}
        rotation={model.rotation}
        scale={model.scale}
        position={model.pos}
      />
    ));
  };

  return (
    <div>
      {!isPreview && (
        <ActionMenu
          togglePreview={togglePreview}
          rotateValue={rotateValue}
          scaleValue={scaleValue}
          toggleSidebar={() => setShowSidebar(!showSidebar)}
          setScaleValue={setScaleValue}
          setRotateValue={setRotateValue}
          toggleMapGrid={toggleMapGrid}
          currentModel={currentModel}
          removeModel={removeModel}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          width: "100%",
          height: isPreview ? "100vh" : "calc(100vh - 70px)",
          overflow: "hidden",
        }}
      >
        {showSidebar && !isPreview && (
          <AssetMenu setSpawningModel={setSpawningModel} addModel={addModel} />
        )}
        {isPreview && <Crosshair />}
        {isPreview && (
          <div
            onClick={(e)=>{
              e.stopPropagation();
              setIsPreview(false)
            }}
            style={{
              position: "fixed",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              top: 40,
              right: 40,
              borderRadius:'50%',
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.7)",
              width: 50,
              height: 50,
              zIndex: 2000,
              cursor: "pointer",
            }}
          >
            <CloseOutlined />
          </div>
        )}
        <Canvas
          camera={{ position: [25, 25, 25] }}
          style={{ backgroundColor: "black" }}
          shadows
        >
          {isPreview && <Sky sunPosition={[100, 25, 100]} />}
          {!isPreview && (
            <OrbitControls
              enabled={!isDragging}
              maxPolarAngle={Math.PI / 2.2}
            />
          )}
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
            <Player isPreview={isPreview} position={[0, 3, 10]} />
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
    </div>
  );
};

export default CityPlannerTool;
