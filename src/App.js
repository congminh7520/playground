import "./App.css";
import FovGame from "./demo/fovGame";
import CityPlannerTool from "./demo/PlannerTool";
import "antd/dist/antd.css";
// import DemoBlockchain from "./demo/blockchain";
import DemoThree from "./demo/threejs";
import DemoCanvas from "./demo/Canvas";

function App() {
  return (
    <div style={{ height: "100vh" }}>
      <DemoCanvas />
    </div>
  );
}

export default App;
