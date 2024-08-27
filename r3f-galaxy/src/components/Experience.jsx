import { CameraControls, OrbitControls } from "@react-three/drei";
import { Galaxy } from "./Galaxy";

export const Experience = () => {
  return (
    <>
      <CameraControls />
      <Galaxy />
    </>
  );
};
