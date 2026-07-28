import { useMemo } from 'react';
import * as THREE from 'three';
import { LIGHTING, SCENE } from './colors';

/**
 * Lighting Rig - Warm Candlelit Artisan Workshop
 *
 * ARCHITECTURE-v2 §7 Locked Lighting Recipe:
 * - Key Light: Warm spot (3500K), casts shadow, from lamp position
 * - Fill Light: Cool ambient (6500K), no shadow, subtle
 * - Rim Light: Brass catch (3000K), edge definition
 * - All lights use ACESFilmic tone mapping compatible intensities
 */
export function LightRig() {
  const keyLight = useMemo(() => {
    const light = new THREE.SpotLight(LIGHTING.key, 1.2); // 3500K warm
    light.position.set(-0.95, 3.2, 0); // Lamp bulb position
    light.target.position.set(0, 0.35, 0);
    light.angle = Math.PI / 4; // 45° cone
    light.penumbra = 0.35;
    light.decay = 2;
    light.distance = 12;
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 20;
    light.shadow.camera.fov = 50;
    light.shadow.bias = -0.0005;
    light.shadow.normalBias = 0.02;
    light.shadow.radius = 2;
    return light;
  }, []);

  const fillLight = useMemo(() => {
    const light = new THREE.DirectionalLight(LIGHTING.fill, 0.18); // 6500K cool fill
    light.position.set(-3, 4, -2);
    light.castShadow = false;
    return light;
  }, []);

  const rimLight = useMemo(() => {
    const light = new THREE.DirectionalLight(LIGHTING.rim, 0.12); // 3000K brass rim
    light.position.set(4, 6, 3);
    light.castShadow = false;
    return light;
  }, []);

  const ambientLight = useMemo(() => {
    const light = new THREE.AmbientLight(LIGHTING.ambient, 0.22); // Warm ambient haze
    return light;
  }, []);

  // Hemisphere light for subtle ground/sky color variation
  const hemiLight = useMemo(() => {
    const light = new THREE.HemisphereLight(SCENE.hemiGround, SCENE.hemiSky, 0.15);
    light.position.set(0, 5, 0);
    return light;
  }, []);

  return (
    <group>
      <primitive object={ambientLight} />
      <primitive object={hemiLight} />
      <primitive object={keyLight} />
      <primitive object={fillLight} />
      <primitive object={rimLight} />
    </group>
  );
}

/**
 * Fog configuration for warm atmosphere
 * ARCHITECTURE-v2 §1: "Warm candlelight/ember glow, not void black"
 */
export function SceneFog() {
  return (
    <>
      <fog attach="fog" args={[SCENE.fog, 4, 18]} />
      <color attach="background" args={[SCENE.fog]} />
    </>
  );
}

export default LightRig;