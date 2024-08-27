import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { CameraControls, Environment } from "@react-three/drei";

function App() {
  return (
    <Canvas shadows style={{ backgroundColor: "black" }}>
      {/* <Environment preset="night" background /> */}
      <Experience />
    </Canvas>
  );
}

export default App;
