import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export class Visualizer {
  constructor(mesh, frequencyUniformName) {
    this.mesh = mesh;
    this.frequencyUniformName = frequencyUniformName;
    console.log("class init");
    this.listener = new THREE.AudioListener();
    this.mesh.add(this.listener);

    this.sound = new THREE.Audio(this.listener);
    this.loader = new THREE.AudioLoader();

    this.analyzer = new THREE.AudioAnalyser(this.sound, 32);
  }

  async load(path) {
    console.log("load init");
    this.loader.load(path, (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);
      this.sound.play();
    });
  }

  getFrequency() {
    return this.analyzer.getAverageFrequency();
  }

  update() {
    const freq = Math.max(this.getFrequency() - 100, 0) / 50;
    // console.log(freq);
  }
}

export const AudioVisualizer = ({ path }) => {
  const meshRef = useRef(null); // Ссылка на объект Three.js
  const [visualizer, setVisualizer] = useState(null); // Состояние для Visualizer

  console.log("Render");

  useEffect(() => {
    (async () => {
      if (meshRef.current && !visualizer) {
        const newVisualizer = new Visualizer(
          meshRef.current,
          "uAudioFrequency"
        );

        await newVisualizer.load(path);
        console.log("setState");

        setVisualizer(newVisualizer);
      }
    })();
  }, [meshRef.current]);

  //   useEffect(() => {
  //     (async () => {
  //       // Создаем Visualizer после загрузки объекта Three.js
  //       if (meshRef.current && !visualizer) {
  //         const newVisualizer = new Visualizer(
  //           meshRef.current,
  //           "uAudioFrequency"
  //         ); // Передайте название uniform-переменной
  //         await newVisualizer.load(path); // Загрузите аудио файл
  //         setVisualizer(newVisualizer);
  //       }
  //     })();
  //   }, [meshRef.current]);

  //   Обновляем визуализацию на каждом кадре
  useFrame(() => {
    if (visualizer) {
      visualizer.update();
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        attach="material"
        uniforms={{
          uAudioFrequency: { value: 0 }, // Uniform для частоты
        }}
      />
    </mesh>
  );
};
