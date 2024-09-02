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
} from "@react-three/postprocessing";
import * as Tone from "tone";
import { Howl } from "howler";
import ReactHowler from "react-howler";
import track from "/music/track.mp3";
import { Analyzer } from "./components/Analyzer";

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
  // const [lightIntensity, setLightIntensity] = useState(10);

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
  const sound = useRef();

  const [lightIntensity, setLightIntensity] = useState(10);

  // const sound = useLoader(THREE.AudioLoader, track);
  // const audioListener = useRef(null);
  // const audioLoader = useRef(new THREE.AudioLoader());
  // const audio = useRef(null);

  // useEffect(() => {
  //   // Создаем AudioListener
  //   audioListener.current = new THREE.AudioListener();

  //   // Загружаем аудио файл
  //   audioLoader.current.load(track, (buffer) => {
  //     audio.current = new THREE.Audio(audioListener.current);
  //     audio.current.setBuffer(buffer);
  //     audio.current.play();
  //     console.log("audio: , ", audio.current);
  //     // Очищаем обработчик
  //     return () => {
  //       audio.current.stop();
  //     };
  //   });
  // }, []);

  // const analyser = useRef();

  // useEffect(() => {
  //   if (audio.current) {
  //     console.log("ready");
  //     analyser.current = new THREE.AudioAnalyser(audio.current, 32);
  //   }
  // }, [audio]);
  // useFrame(() => {

  //     const data = analyser.current.getAverageFrequency();
  //     console.log(data);
  //     // mesh.current.material.color.setRGB(data / 100, 0, 0);
  //     // mesh.current.scale.x =
  //     //   mesh.current.scale.y =
  //     //   mesh.current.scale.z =
  //     //     (data / 100) * 2;
  //   }
  // });

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();
    if (pointLightRef.current) {
      pointLightRef.current.position.x = Math.sin(elapsedTime) * 1.8;
      pointLightRef.current.position.z = Math.cos(elapsedTime) * 1.8;

      // blicking
      // pointLightRef.current.intensity = Math.random() > 0.995 ? 1 : 0;
    }

    // if (analyser.current) {
    //   const data = analyser.current.getAverageFrequency();
    //   console.log("data: ", data);
    //   // mesh.current.material.color.setRGB(data / 100, 0, 0);
    //   // mesh.current.scale.x =
    //   //   mesh.current.scale.y =
    //   //   mesh.current.scale.z =
    //   //     (data / 100) * 2;
    // }
  });

  return (
    <Suspense fallback={<>loading...</>}>
      <Analyzer sound={sound} />
      <PositionalAudio autoplay url={track} ref={sound} />
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

      <pointLight
        castShadow
        ref={pointLightRef}
        intensity={0.5}
        position={[0, 0, 0]}
        // color="darkgreen"
      />
      <Grid position={[0, 1, 0]} />
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
      </EffectComposer>
    </Suspense>
  );
};

function App() {
  return (
    <>
      {/* <ReactHowler
        onLoad={(value) => {
          // setAudio(value);
        }}
        ref={(ref) => {
          audio.current = ref;
        }}
        src={track}
        playing={true}
      /> */}
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
