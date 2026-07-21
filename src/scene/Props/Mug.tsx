export default function Mug() {
  return (
    <group position={[2.4, 0.09, 1.5]}>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.18, 20]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.4} />
      </mesh>
      <mesh position={[0.14, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.018, 8, 16, Math.PI * 1.3]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.4} />
      </mesh>
    </group>
  );
}
