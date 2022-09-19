import { Button, Slider, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  FullscreenOutlined,
  RetweetOutlined,
  EyeOutlined,
  BorderlessTableOutlined,
  DoubleLeftOutlined,
  ExportOutlined,
} from "@ant-design/icons";

const ActionMenu = ({
  removeModel,
  rotateValue,
  setRotateValue,
  currentModel,
  toggleMapGrid,
  scaleValue,
  setScaleValue,
  togglePreview,
  toggleSidebar,
}) => {
  const [isRotate, setIsRotate] = useState(false);
  const [isScale, setIsScale] = useState(false);

  useEffect(() => {
    if (!currentModel) {
      setIsRotate(false);
      setIsScale(false);
    }
  }, [currentModel]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#001529",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#29a0f6",
          fontSize: 20,
        }}
      >
        <DoubleLeftOutlined />
        <Typography.Title
          style={{ whiteSpace: "nowrap", color: "white", marginBottom: 0 }}
          level={4}
        >
          Type title
        </Typography.Title>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: 8,
        }}
      >
        <Tooltip placement="bottom" title="Remove">
          <Button disabled={!currentModel} onClick={removeModel}>
            <DeleteOutlined />
          </Button>
        </Tooltip>
        <div
          style={{
            position: "relative",
          }}
        >
          <Tooltip placement="bottom" title="Scale">
            <Button
              onClick={() => setIsScale(!isScale)}
              disabled={!currentModel}
            >
              <FullscreenOutlined />
            </Button>
          </Tooltip>
          {isScale && (
            <Slider
              style={{
                position: "absolute",
                top: "100%",
                left: "-5px",
                height: 0,
                width: "100%",
                zIndex: 2000,
              }}
              min={1}
              max={5}
              onChange={(value) => setScaleValue(value)}
              value={typeof scaleValue === "number" ? scaleValue : 1}
            />
          )}
        </div>
        <div
          style={{
            position: "relative",
          }}
        >
          <Tooltip placement="bottom" title="Rotate">
            <Button
              onClick={() => setIsRotate(!isRotate)}
              disabled={!currentModel}
            >
              <RetweetOutlined />
            </Button>
          </Tooltip>
          {isRotate && (
            <Slider
              style={{
                position: "absolute",
                top: "100%",
                left: "-5px",
                height: 0,
                width: "100%",
                zIndex: 2000,
              }}
              min={0}
              max={360}
              onChange={(value) => setRotateValue(value)}
              value={typeof rotateValue === "number" ? rotateValue : 0}
            />
          )}
        </div>
        <Tooltip placement="bottom" title="Map grid">
          <Button onClick={toggleMapGrid}>
            <BorderlessTableOutlined />
          </Button>
        </Tooltip>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Tooltip placement="bottom" title="Preview">
          <Button onClick={togglePreview} disabled={currentModel}>
            <EyeOutlined />
          </Button>
        </Tooltip>
        <Tooltip placement="bottom" title="Toggle sidebar">
          <Button onClick={toggleSidebar} disabled={currentModel}>
            <ExportOutlined />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ActionMenu;
