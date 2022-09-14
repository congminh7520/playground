import { models } from "../threejs/model";

const AssetMenu = ({ setSpawningModel,addModel }) => {
  const renderAssets = () => {
    return models?.map((model, index) => {
      return (
        <div
          draggable="true"
          onPointerDown={(e) => {
            e.stopPropagation();
            setSpawningModel(model.url);
          }}
          key={index}
          style={{
            padding: 20,
            cursor: "pointer",
          }}
        >
          <img
            style={{ width: 50, height: 50 }}
            onClick={()=>addModel(Math.floor(Math.random() * 9), 0.5, Math.floor(Math.random() * 9))}
            src={model.thumb}
            name={model.name}
          />
        </div>
      );
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        background: "white",
        top: 0,
        left: 0,
        zIndex: 999,
      }}
    >
      {renderAssets()}
    </div>
  );
};

export default AssetMenu;
