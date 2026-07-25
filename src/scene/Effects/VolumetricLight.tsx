import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Volumetric light shaft (god rays) from the lamp
 * Uses a cone mesh with a custom shader for light scattering effect
 */
export function VolumetricLight({ lightRef }: { lightRef: React.RefObject<THREE.PointLight | null> }) {
  const coneRef = useRef<THREE.Mesh<THREE.ConeGeometry, THREE.MeshBasicMaterial> | null>(null);
  const clock = useRef(0);

  const geometry = useMemo(() => {
    // Cone pointing downward from lamp position
    const geo = new THREE.ConeGeometry(1.2, 3.5, 32, 1, true);
    geo.translate(0, -1.75, 0); // Center the cone
    geo.rotateX(Math.PI); // Point downward
    return geo;
  }, []);

  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xffaa33,
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
    side: THREE.BackSide, // Render inside of cone
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((_, delta) => {
    clock.current += delta;
    if (!coneRef.current || !lightRef.current) return;

    const light = lightRef.current;
    const mesh = coneRef.current;

    // Position cone at light position
    mesh.position.copy(light.position);
    mesh.position.y -= 0.1; // Slight offset

    // Subtle breathing animation synced to light intensity
    const intensity = light.intensity || 1;
    mesh.material.opacity = 0.06 + Math.sin(clock.current * 1.5) * 0.02 * intensity;
    mesh.scale.y = 1 + Math.sin(clock.current * 0.7) * 0.05;
  });

  return (
    <mesh ref={coneRef} geometry={geometry} material={material} position={[-0.95, 3.2, 0]} />
  );
}

/**
 * Alternative: More advanced volumetric light using a shader
 * for realistic light scattering (disabled by default)
 */
export function VolumetricLightAdvanced({ lightRef }: { lightRef: React.RefObject<THREE.PointLight | null> }) {
  const meshRef = useRef<THREE.Mesh<THREE.CylinderGeometry, THREE.ShaderMaterial> | null>(null);
  const clock = useRef(0);

  const geometry = useMemo(() => new THREE.CylinderGeometry(0.1, 1.5, 3.5, 32, 1, true), []);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uLightPos: { value: new THREE.Vector3() },
      uLightColor: { value: new THREE.Color(0xffaa33) },
      uLightIntensity: { value: 1 },
      uCameraPos: { value: new THREE.Vector3() },
    },
    vertexShader: /* glsl */`
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform vec3 uLightPos;
      uniform vec3 uLightColor;
      uniform float uLightIntensity;
      uniform vec3 uCameraPos;
      varying vec3 vWorldPosition;
      varying vec3 vNormal;

      float volumetricScattering(vec3 rayDir, vec3 lightDir, float distance) {
        float cosAngle = dot(normalize(rayDir), normalize(lightDir));
        float scattering = pow(max(cosAngle, 0.0), 8.0);
        return scattering * (1.0 / (distance * distance + 0.1));
      }

      void main() {
        vec3 viewDir = normalize(vWorldPosition - uCameraPos);
        vec3 lightDir = uLightPos - vWorldPosition;
        float dist = length(lightDir);

        float scattering = volumetricScattering(viewDir, lightDir, dist);
        float density = smoothstep(3.5, 0.0, dist) * scattering;

        // Add noise for organic feel
        float noise = sin(vWorldPosition.y * 10.0 + uTime * 2.0) *
                      sin(vWorldPosition.x * 5.0 + uTime * 1.5) * 0.1;
        density += noise;

        vec3 color = uLightColor * density * uLightIntensity * 0.15;
        float alpha = density * 0.3;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((_, delta) => {
    clock.current += delta;
    if (!meshRef.current || !lightRef.current) return;

    const mesh = meshRef.current;
    const light = lightRef.current;

    mesh.position.copy(light.position);
    mesh.position.y -= 0.1;

    mesh.material.uniforms.uTime.value = clock.current;
    mesh.material.uniforms.uLightPos.value.copy(light.position);
    mesh.material.uniforms.uLightIntensity.value = light.intensity || 1;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} position={[-0.95, 3.2, 0]} />
  );
}

export default VolumetricLight;