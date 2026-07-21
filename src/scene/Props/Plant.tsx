export default function Plant() {
  return (
    <group position={[-2.9, 0, -1.1]}>
      <mesh position={[0, 0.11, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.13, 0.22, 16]} />
        <meshStandardMaterial color="#3a2418" roughness={0.7} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => {
        const ang = (i / 7) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(ang) * 0.09, 0.32 + Math.random() * 0.18, Math.sin(ang) * 0.09]}
            scale={[0.8, 1.3, 0.8]}
          >
            <sphereGeometry args={[0.11 + Math.random() * 0.05, 8, 8]} />
            <meshStandardMaterial color="#2e4a2e" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}
