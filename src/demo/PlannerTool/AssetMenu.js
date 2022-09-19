import { Typography } from "antd";
import { models } from "../threejs/model";

const AssetMenu = ({ setSpawningModel, addModel }) => {
  const renderAssets = () => {
    return models?.map((model, index) => {
      return (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            setSpawningModel(model.url);
          }}
          key={index}
          style={{
            width: 50,
            height: 50,
            cursor: "pointer",
            backgroundColor: "#fff",
            borderRadius: 8,
          }}
        >
          <img
            style={{ width: "100%", height: "100%" }}
            onClick={() =>
              addModel(
                Math.floor(Math.random() * 9),
                0.5,
                Math.floor(Math.random() * 9)
              )
            }
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
        backgroundColor: "#001529",
        padding: 20,
        minWidth: 300,
        height:'100%'
      }}
    >
      <Typography.Title style={{ color: "white", marginBottom: 16 }} level={3}>
        Assets pack
      </Typography.Title>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          overflow:'auto',
          height:'100%'
        }}
      >
        {renderAssets()}
      </div>
    </div>
  );
};

export default AssetMenu;
