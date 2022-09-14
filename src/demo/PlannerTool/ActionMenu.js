import { Button } from "antd";

const ActionMenu = ({ removeModel, currentPos,toggleMapGrid }) => {
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
      <Button type="primary" disabled={!currentPos.length > 0}>
        scale
      </Button>
      <Button type="warning" disabled={!currentPos.length > 0}>
        rotate
      </Button>
      <Button type="warning" onClick={toggleMapGrid}>
        Toggle map grid
      </Button>
    </div>
  );
};

export default ActionMenu;
