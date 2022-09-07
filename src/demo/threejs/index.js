import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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
  const [primitiveModels, setPrimitiveModels] = useState([]);
  const [isRotate, setIsRotate] = useState(false);
  const [currentModel, setCurrentModel] = useState();
  const [ground,setGround] = useState(planes[0])

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
    const texture = useLoader(
      THREE.TextureLoader,
      ground.url
    );
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[20, 20]} />
        <meshBasicMaterial attach="material" map={texture} toneMapped={false} />
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
        isRotate={isRotate}
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
            top: '100%',
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
        </div>
      </div>
    </div>
  );
};

export default DemoThree;
