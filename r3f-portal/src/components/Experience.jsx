import * as THREE from "three";
import { CameraControls, Environment, MeshPortalMaterial, OrbitControls, RoundedBox, Text, useCursor, useTexture } from "@react-three/drei";
import { Demon } from "./Demon";
import { Ninja } from "./Ninja";
import { Wizard } from "./Wizard";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  useCursor(hovered);

  const scene = useThree((state) => state.scene);

  const controlsRef = useRef();

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(0, 0, 5, targetPosition.x, targetPosition.y, targetPosition.z, true);
    } else {
      controlsRef.current.setLookAt(0, 0, 10, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      {/* <OrbitControls /> */}
      <CameraControls ref={controlsRef} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6} />
      <ambientLight intensity={0.5} />
      <Environment preset="night" />
      <MonsterStage
        active={active}
        name="Wizard"
        hovered={hovered}
        setActive={setActive}
        setHovered={setHovered}
        text={"Wizard"}
        color="#682d83"
        texture={"/img/panorama-1.jpg"}
      >
        <Wizard hovered={hovered === "Wizard"} scale={0.6} position-y={-1} />
      </MonsterStage>
      <MonsterStage
        active={active}
        name="Demon 1"
        hovered={hovered}
        setActive={setActive}
        setHovered={setHovered}
        text={"Demon"}
        color="#9d142a"
        rotation-y={Math.PI / 8}
        position-x={-2.5}
        texture={"/img/panorama-2.jpg"}
      >
        <Demon name={"Demon 1"} hovered={hovered === "Demon 1"} scale={0.6} position-y={-1} />
      </MonsterStage>
      <MonsterStage
        active={active}
        name="Demon 2"
        hovered={hovered}
        setActive={setActive}
        setHovered={setHovered}
        text={"Demon X"}
        color="#9d142a"
        rotation-y={-Math.PI / 8}
        position-x={2.5}
        texture={"/img/panorama-3.jpg"}
      >
        <Demon name={"Demon 2"} hovered={hovered === "Demon 2"} scale={0.6} position-y={-1} />
      </MonsterStage>
    </>
  );
};

const MonsterStage = ({ children, texture, text, color, name, active, setActive, hovered, setHovered, ...props }) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();

  useFrame((_state, delta) => {
    const worldOpen = active === name;

    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });

  return (
    <group {...props}>
      <Text font="fonts/Caprasimo-Regular.ttf" fontSize={0.3} position={[0, -1.3, 0.051]} anchorY="bottom">
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onPointerEnter={() => setHovered(name)}
        onPointerLeave={() => setHovered(null)}
        onDoubleClick={() => setActive(active === name ? null : name)}
      >
        <MeshPortalMaterial ref={portalMaterial} side={THREE.DoubleSide}>
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
