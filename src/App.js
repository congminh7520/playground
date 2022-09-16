import "./App.css";
import FovGame from "./demo/fovGame";
import CityPlannerTool from "./demo/PlannerTool";
import "antd/dist/antd.css";
// import DemoBlockchain from "./demo/blockchain";
import DemoThree from "./demo/threejs";

function App() {
  return (
    <div style={{ height: "100vh" }}>
      <CityPlannerTool />
      {/* <FovGame/> */}
    </div>
  );
}

export default App;
