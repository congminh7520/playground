import { Button, Slider } from "antd";
import { useEffect, useState } from "react";

const ActionMenu = ({
  removeModel,
  rotateValue,
  setRotateValue,
  currentModel,
  toggleMapGrid,
  scaleValue,
  setScaleValue,
  togglePreview,
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
        position: "fixed",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        top: 0,
        right: 0,
        zIndex: 999,
      }}
    >
      <Button type="danger" disabled={!currentModel} onClick={removeModel}>
        remove
      </Button>
      <div>
        <Button
          onClick={() => setIsScale(!isScale)}
          type="primary"
          disabled={!currentModel}
        >
          scale
        </Button>
        {isScale && (
          <Slider
            min={1}
            max={5}
            onChange={(value) => setScaleValue(value)}
            value={typeof scaleValue === "number" ? scaleValue : 1}
          />
        )}
      </div>
      <div>
        <Button onClick={() => setIsRotate(!isRotate)} disabled={!currentModel}>
          rotate
        </Button>
        {isRotate && (
          <Slider
            min={0}
            max={360}
            onChange={(value) => setRotateValue(value)}
            value={typeof rotateValue === "number" ? rotateValue : 0}
          />
        )}
      </div>
      <Button onClick={toggleMapGrid}>Toggle map grid</Button>
      <Button onClick={togglePreview} disabled={currentModel}>
        Preview
      </Button>
    </div>
  );
};

export default ActionMenu;
