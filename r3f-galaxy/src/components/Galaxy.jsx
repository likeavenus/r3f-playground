import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import galaxyVertexShader from "../shaders/galaxy/vertex.glsl";
import galaxyFragmentShader from "../shaders/galaxy/fragment.glsl";
import { useControls } from "leva";

const parameters = {};
parameters.count = 210000;
parameters.size = 0.005;
parameters.radius = 5;
parameters.branches = 9;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 5;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

const insideColor = new THREE.Color(parameters.insideColor);
const outsideColor = new THREE.Color(parameters.outsideColor);

export const Galaxy = () => {
  const pointsRef = useRef(null);
  const renderer = useThree((state) => state.gl);
  const { branches, rotationSpeed } = useControls({
    branches: 9,
    rotationSpeed: 0.1,
  });

  const uniforms = useMemo(
    () => ({
      uSize: {
        value: 30 * renderer.getPixelRatio(),
      },
      uTime: {
        value: 0.0,
      },
      uRotationSpeed: {
        value: rotationSpeed,
      },
    }),
    []
  );

  const onClick = () => {};

  const [positions, colors, randomness, scales] = useMemo(() => {
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const randomness = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count * 1);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      // Position
      const radius = Math.random() * parameters.radius;

      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      //   const branchAngle = (i % branches) / (branches * Math.PI * 2);

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

      positions[i3] = Math.cos(branchAngle) * radius;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = Math.sin(branchAngle) * radius;

      randomness[i3] = randomX;
      randomness[i3 + 1] = randomY;
      randomness[i3 + 2] = randomZ;

      // Color
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Scale
      scales[i] = Math.random();
    }

    return [positions, colors, randomness, scales];
  }, []);

  const explosionSpeed = 55;
  useFrame((state, delta) => {
    if (pointsRef && pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      pointsRef.current.material.uniforms.uRotationSpeed.value = rotationSpeed;
    }

    // if (Math.random() > 0.95) {
    //   console.log(pointsRef.current.material.uniforms);
    // }

    // pointsRef.current.rotation.z += 0.001;
    // pointsRef.current.rotation.y += 0.0001;
    // const positions = pointsRef.current.geometry.getAttribute("position");
    // const colors = pointsRef.current.geometry.getAttribute("color");

    // for (let i = 0; i < positions.array.length; i += 3) {
    //   const unitVector = new THREE.Vector3(positions.array[i], positions.array[i + 1], positions.array[i + 2]).normalize();
    //   // positions.array[i] +=
    //   //   unitVector.x * (explosionSpeed * Math.random() * 2) * delta;
    //   // positions.array[i + 1] +=
    //   //   unitVector.y * (explosionSpeed * Math.random() * 2) * delta;
    //   // positions.array[i + 2] += unitVector.z * explosionSpeed * delta;
    //   positions.array[i] -= unitVector.x * explosionSpeed * Math.sin(delta);
    //   positions.array[i + 1] -= unitVector.y * explosionSpeed * Math.sin(delta);
    //   // positions.array[i + 2] += unitVector.z * explosionSpeed * Math.sin(delta);
    //   positions.array[i + 2] -= unitVector.z * explosionSpeed * Math.sin(delta) * Math.random() * 3;
    //   // if (Math.random() > 0.999999) {
    //   // }
    // }
    // positions.needUpdate = true;
    // colors.needUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]} name="sphere">
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} itemSize={3} count={colors.length / 3} />
        <bufferAttribute attach="attributes-aRandomness" array={randomness} itemSize={3} count={randomness.length / 3} />
        <bufferAttribute attach="attributes-aScale" array={scales} itemSize={3} count={scales.length / 3} />
      </bufferGeometry>
      {/* <pointsMaterial attach="material" size={parameters.size} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} vertexColors /> */}
      <shaderMaterial
        attach="material"
        size={parameters.size}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        vertexShader={galaxyVertexShader}
        fragmentShader={galaxyFragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
};
