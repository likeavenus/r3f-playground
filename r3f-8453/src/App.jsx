import * as THREE from "three";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useRef, useEffect, useState } from "react";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
  Glitch,
} from "@react-three/postprocessing";
import track from "/music/track.mp3";
import pribil from "/music/pribil.mp3";
import wae from "/music/wae.mp3";
import platina from "/music/platina!.mp3";

import { AudioVisualizer } from "./components/Visualizer";

import {
  CameraControls,
  Environment,
  Grid,
  Helper,
  SpotLight,
  useDepthBuffer,
  useGLTF,
  PositionalAudio,
} from "@react-three/drei";

function MovingSpot({ vec = new THREE.Vector3(), intensity = 20, ...props }) {
  const light = useRef();
  const viewport = useThree((state) => state.viewport);

  useFrame((state) => {
    light.current.target.position.lerp(
      vec.set(
        (state.pointer.x * viewport.width) / 2,
        (state.pointer.y * viewport.height) / 2,
        0
      ),
      0.1
    );
    light.current.target.updateMatrixWorld();
  });

  return (
    <SpotLight
      castShadow
      ref={light}
      penumbra={1}
      distance={6}
      angle={0.35}
      attenuation={5}
      anglePower={4}
      intensity={intensity}
      {...props}
    />
  );
}

export const SceneThree = () => {
  const depthBuffer = useDepthBuffer({ frames: 1, size: 1 });
  const { nodes, materials } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/dragon/model.gltf"
  );

  const pointLightRef = useRef();

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();
    if (pointLightRef.current) {
      pointLightRef.current.position.x = Math.sin(elapsedTime) * 1.8;
      pointLightRef.current.position.z = Math.cos(elapsedTime) * 1.8;
    }
  });

  return (
    <Suspense fallback={<>loading...</>}>
      <AudioVisualizer path={wae} />

      {/* <Analyzer sound={sound} /> */}
      {/* <PositionalAudio autoplay url={track} ref={sound} /> */}
      <CameraControls />
      <Physics debug={false}>
        <Experience />
        <RigidBody>
          <mesh
            position={[0, -1.03, 0]}
            castShadow
            receiveShadow
            geometry={nodes.dragon.geometry}
            material={materials["Default OBJ.001"]}
            dispose={null}
          />
        </RigidBody>
        <RigidBody>
          <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[50, 50]} />
            <meshPhongMaterial />
          </mesh>
        </RigidBody>
      </Physics>
      <MovingSpot
        depthBuffer={depthBuffer}
        color="#0c8cbf"
        position={[3, 2.2, 2]}
        // intensity={lightIntensity}
        intensity={20}
      />
      <MovingSpot
        depthBuffer={depthBuffer}
        color="#b00c3f"
        position={[1, 2.2, 0]}
        // intensity={lightIntensity}
        intensity={20}
      />

      {/* <pointLight
        castShadow
        ref={pointLightRef}
        intensity={0.5}
        position={[0, 0, 0]}
        // color="darkgreen"
      /> */}
      {/* <Grid position={[0, 1, 0]} /> */}
      <EffectComposer>
        {/* <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        /> */}
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
        {/* <Noise opacity={0.02} /> */}
        {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
        {/* <Glitch
          delay={[1.5, 3.5]} // min and max glitch delay
          duration={[0.6, 1.0]} // min and max glitch duration
          strength={[0.3, 1.0]} // min and max glitch strength
          // mode={GlitchMode.SPORADIC} // glitch mode
          active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
          ratio={0.85} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
        /> */}
      </EffectComposer>
    </Suspense>
  );
};

function App() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [-2, 2, 6], fov: 50, near: 1, far: 20 }}
      >
        <color attach="background" args={["#202020"]} />
        <fog attach="fog" args={["#202020", 5, 20]} />
        {/* <ambientLight intensity={0.015} /> */}
        <SceneThree />
      </Canvas>
    </>
  );
}

export default App;
