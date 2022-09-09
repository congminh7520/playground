import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  OrbitControls,
  Stars,
  useTexture,
  Plane,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import Obj from "./obj";
import { models, planes } from "./model";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";

const DemoThree = () => {
  const [isDragging, setIsDragging] = useState(false);
  const mapSize = [20, 20];
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const [isRotate, setIsRotate] = useState(false);
  const [currentModel, setCurrentModel] = useState();
  const [ground, setGround] = useState(planes[0]);

  // Obj array to render models
  const [primitiveModels, setPrimitiveModels] = useState([]);
  // Array to fetch models from first load
  const [fetchModels, setFetchModels] = useState([]);
  // Store an array of mesh info need to submit to api
  const [objModels, setModels] = useState([]);

  // Handle toggle isRotate for each 3d model item
  useEffect(() => {
    setPrimitiveModels(
      primitiveModels.map((model) => {
        return {
          ...model,
          props: {
            ...model.props,
            isRotate,
          },
        };
      })
    );
  }, [isRotate]);

  useEffect(() => {
    const savedModels = JSON.parse(localStorage.getItem("models"));
    setFetchModels(savedModels);
  }, []);

  useEffect(() => {
    fetchModels?.map((model) => {
      const data = {
        url: model.url,
        thumb: model.thumb,
        name: model.name,
      };
      const char = {
        position: [model.position.x, model.position.y, model.position.z],
        rotation: [0, model.rotation?._y, 0],
      };
      addNewPrimitiveModels(data, char);
    });
  }, [fetchModels]);
  
  const deleteCurrentItem = () => {
    const model = primitiveModels.findIndex(
      (model) => model?.key === currentModel?.key
    );
    setPrimitiveModels(
      primitiveModels.filter((value, index) => index !== model)
    );
    setModels(objModels.filter((value, index) => index !== model));
  };

  const Model = ({ model }) => {
    const { scene } = useGLTF(model.url);
    const copiedScene = useMemo(() => scene.clone(), [scene]);

    return (
      <Suspense fallback={<p>...loading</p>}>
        <primitive object={copiedScene} />
        <meshBasicMaterial
          attach="material"
          color="white"
          roughness={0.3}
          metalness={1.0}
        />
      </Suspense>
    );
  };

  const Ground = () => {
    const texture = useTexture(ground.url);
    return (
      <Plane args={[20, 20]} rotation-x={-Math.PI / 2}>
        <meshBasicMaterial attach="material" map={texture} toneMapped={false} />
      </Plane>
    );
  };
  
  const handleSaveChange = () => {
      localStorage.setItem("models", JSON.stringify(objModels));
  };

  const handleAddModel = (mesh) => {
    setModels(prevModels=>[...prevModels, mesh]);
  };

  const addNewPrimitiveModels = (data, char) => {
    const obj = (
      <Obj
        key={Math.random()}
        handleAddModel={handleAddModel}
        onClick={(e) => {
          setCurrentModel(obj);
        }}
        model={data}
        isRotate={isRotate}
        onPointerMissed={() => setCurrentModel(null)}
        position={
          char
            ? char.position
            : [Math.floor(Math.random() * 9), 0, Math.floor(Math.random() * 9)]
        }
        rotation={char ? char.rotation : [0, Math.floor(Math.random() * 9), 0]}
        setIsDragging={setIsDragging}
        floorPlane={floorPlane}
        mapSize={mapSize}
      >
        <Model model={data} />
      </Obj>
    );
    setPrimitiveModels((prevModels) => [...prevModels, obj]);
  };

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <Canvas
        style={{ backgroundColor: "#29252e" }}
        camera={{ position: [-15, 15, 15] }}
      >
        <OrbitControls maxPolarAngle={Math.PI / 2.2} enabled={!isDragging} />
        <ambientLight intensity={1.2} color={0xffffff} />
        <spotLight
          intensity={0.3}
          color={0xffffff}
          position={[100, 1000, 100]}
        />
        <Stars />
        <Ground />
        <Selection>
          <EffectComposer multisampling={8} autoClear={false}>
            <Outline
              blur
              visibleEdgeColor="yellow"
              edgeStrength={10}
              width={2200}
            />
          </EffectComposer>
          {[...primitiveModels]}
        </Selection>
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "rgba(251, 255, 125,0.7)",
          padding: "20px",
        }}
      >
        <h1>Models</h1>
        {models.map((model) => (
          <img
            style={{
              width: 50,
              height: 50,
              marginRight: "12px",
              cursor: "pointer",
            }}
            onClick={() => {
              addNewPrimitiveModels(model);
            }}
            key={model.name}
            src={model.thumb}
            alt={model.name}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "rgba(251, 255, 125,0.7)",
            padding: "20px",
          }}
        >
          <h1>Planes</h1>
          {planes.map((plane) => (
            <img
              style={{
                width: 50,
                height: 50,
                marginRight: "12px",
                cursor: "pointer",
              }}
              onClick={() => setGround(plane)}
              key={plane.name}
              src={plane.url}
            />
          ))}
        </div>
        <div>
          <button onClick={deleteCurrentItem}>Remove item</button>
          <button onClick={() => setIsRotate(!isRotate)}>
            {isRotate ? "Drag" : "Rotate"}
          </button>
          <button onClick={handleSaveChange}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default DemoThree;
