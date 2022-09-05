import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense, useEffect, useMemo, useState } from "react";
import Obj from "./obj";
import { models } from "./model";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";

const DemoThree = () => {
  const [isDragging, setIsDragging] = useState(false);
  const mapSize = [20, 20];
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const [primitiveModels, setPrimitiveModels] = useState([]);
  const [currentModel, setCurrentModel] = useState();

  const deleteCurrentItem = () => {
    const model = primitiveModels.findIndex(
      (model) => model?.key === currentModel?.key
    );
    setPrimitiveModels(
      primitiveModels.filter((value, index) => index !== model)
    );
  };

  const Model = ({ model }) => {
    const { scene } = useLoader(GLTFLoader, model.url);
    const copiedScene = useMemo(() => scene.clone(), [scene]);

    return (
      <Suspense fallback={<p>...loading</p>}>
        <primitive object={copiedScene} />
      </Suspense>
    );
  };

  const Plane = () => {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeBufferGeometry args={[20, 20]} />
        <meshLambertMaterial color="#567d46" />
      </mesh>
    );
  };

  const addNewPrimitiveModels = (data) => {
    const obj = (
      <Obj
        key={Math.random()}
        onClick={(e) => {
          setCurrentModel(obj);
        }}
        onPointerMissed={() => setCurrentModel(null)}
        defaultPos={[
          Math.floor(Math.random() * 9),
          0,
          Math.floor(Math.random() * 9),
        ]}
        setIsDragging={setIsDragging}
        floorPlane={floorPlane}
        mapSize={mapSize}
      >
        <Model model={data} />
      </Obj>
    );

    setPrimitiveModels([...primitiveModels, obj]);
  };

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <Canvas
        style={{ backgroundColor: "#000" }}
        camera={{ position: [-15, 15, 15] }}
      >
        <OrbitControls enabled={!isDragging} />
        <ambientLight intensity={1.2} color={0xffffff} />
        <Stars />
        <Plane />
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
          backgroundColor: "rgba(3, 44, 252,0.7)",
          padding: "20px",
        }}
      >
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
        <div>
          <button onClick={deleteCurrentItem}>Remove item</button>
          <button onClick={deleteCurrentItem}>Rotate item</button>
        </div>
      </div>
    </div>
  );
};

export default DemoThree;
