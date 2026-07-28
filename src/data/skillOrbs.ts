/**
 * Skill Orb Data — shared between scene layer and UI layer
 * Moved from scene/Props/SkillOrbSystem.tsx to avoid scene→app import violations
 */

export interface SkillOrbData {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'ai' | 'hardware';
  proficiency: number; // 0-1
  description: string;
}

export const SKILL_ORBS: SkillOrbData[] = [
  // Frontend - Ember palette
  { id: 'react', name: 'React', category: 'frontend', proficiency: 0.95, description: 'Hooks, Context, Suspense, R3F integration' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', proficiency: 0.9, description: 'Strict typing, generics, advanced types' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', proficiency: 0.9, description: 'Utility-first, design systems, JIT' },
  { id: 'framer', name: 'Framer Motion', category: 'frontend', proficiency: 0.85, description: 'Animations, gestures, layout animations' },
  { id: 'threejs', name: 'Three.js / R3F', category: 'frontend', proficiency: 0.8, description: 'Shaders, post-processing, InstancedMesh' },

  // Backend - Mystery (amethyst) palette
  { id: 'node', name: 'Node.js', category: 'backend', proficiency: 0.9, description: 'Express, Fastify, native modules' },
  { id: 'python', name: 'Python', category: 'backend', proficiency: 0.85, description: 'FastAPI, asyncio, data pipelines' },
  { id: 'postgres', name: 'PostgreSQL', category: 'backend', proficiency: 0.8, description: 'Advanced queries, indexing, replication' },
  { id: 'redis', name: 'Redis', category: 'backend', proficiency: 0.75, description: 'Caching, pub/sub, streams' },
  { id: 'graphql', name: 'GraphQL', category: 'backend', proficiency: 0.7, description: 'Schema design, resolvers, federation' },

  // DevOps - Teal (verdigris) palette
  { id: 'aws', name: 'AWS', category: 'devops', proficiency: 0.85, description: 'EC2, Lambda, RDS, S3, CloudFront' },
  { id: 'docker', name: 'Docker', category: 'devops', proficiency: 0.9, description: 'Multi-stage builds, compose, swarm' },
  { id: 'k8s', name: 'Kubernetes', category: 'devops', proficiency: 0.7, description: 'Helm, operators, CRDs' },
  { id: 'ci', name: 'CI/CD', category: 'devops', proficiency: 0.8, description: 'GitHub Actions, GitLab CI, pipelines' },
  { id: 'terraform', name: 'Terraform', category: 'devops', proficiency: 0.65, description: 'Modules, state, providers' },

  // AI/ML - Mystery palette
  { id: 'pytorch', name: 'PyTorch', category: 'ai', proficiency: 0.75, description: 'Training, inference, ONNX export' },
  { id: 'llm', name: 'LLM Integration', category: 'ai', proficiency: 0.7, description: 'RAG, fine-tuning, prompt engineering' },
  { id: 'vector', name: 'Vector DBs', category: 'ai', proficiency: 0.65, description: 'Pinecone, Weaviate, pgvector' },

  // Hardware - Brass palette (electronics meet brass)
  { id: 'pcb', name: 'PCB Design', category: 'hardware', proficiency: 0.7, description: 'KiCad, 4-layer, impedance control' },
  { id: 'solder', name: 'Soldering/Assembly', category: 'hardware', proficiency: 0.85, description: 'SMT, through-hole, rework' },
  { id: 'audio', name: 'Audio Systems', category: 'hardware', proficiency: 0.8, description: 'Speaker design, crossovers, amps' },
];
