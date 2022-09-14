import "./App.css";
import FovGame from "./demo/fovGame";
import Crosshair from "./demo/fovGame/Crosshair";
import CityPlannerTool from "./demo/PlannerTool";
// import "antd/dist/antd.css";
// import DemoBlockchain from "./demo/blockchain";
import DemoThree from "./demo/threejs";

function App() {
  return (
    <div style={{ height: "100vh" }}>
      <CityPlannerTool />
    </div>
  );
}

export default App;
