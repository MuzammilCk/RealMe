// Content only — no JSX. Verbatim from 03-CONTENT-STORYLINE.md Ch.02.

export interface Skill {
  cat: string;
  items: string; // mono label string, brass border on hover in the UI
}

export const SKILLS: Skill[] = [
  { cat: 'Frontend', items: 'React · TypeScript · Vite · Tailwind CSS' },
  { cat: 'Backend', items: 'Node.js · Python · FSM-driven service design' },
  {
    cat: 'AI / ML',
    items:
      'Model fine-tuning (Qwen2.5-1.5B) · Real-time multilingual speech-to-text (WhisperLive + faster-whisper) · Multi-agent system design',
  },
  {
    cat: 'Cloud / DevOps',
    items: 'AWS (ECS Fargate, RDS, ElastiCache, ALB, Secrets Manager) · GitHub Actions CI/CD',
  },
  { cat: 'Data', items: 'PostgreSQL, Supabase · Redis' },
];
