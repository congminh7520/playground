import { Button, Slider } from "antd";
import { useEffect, useState } from "react";

const ActionMenu = ({
  removeModel,
  rotateValue,
  setRotateValue,
  currentPos,
  toggleMapGrid,
  scaleValue,
  setScaleValue,
}) => {
  const [isRotate, setIsRotate] = useState(false);
  const [isScale, setIsScale] = useState(false);

  useEffect(() => {
    if (currentPos.length === 0) {
      setIsRotate(false);
      setIsScale(false);
    }
  }, [currentPos]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 999,
      }}
    >
      <Button
        type="danger"
        disabled={!currentPos.length > 0}
        onClick={removeModel}
      >
        remove
      </Button>
      <Button
        onClick={() => setIsScale(!isScale)}
        type="primary"
        disabled={!currentPos.length > 0}
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
      <Button
        onClick={() => setIsRotate(!isRotate)}
        type="warning"
        disabled={!currentPos.length > 0}
      >
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
      <Button type="warning" onClick={toggleMapGrid}>
        Toggle map grid
      </Button>
    </div>
  );
};

export default ActionMenu;
