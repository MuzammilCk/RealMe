// Content only — no JSX. Verbatim from 03-CONTENT-STORYLINE.md Ch.03.
// Order: most technically distinctive first.

export interface ProjectLink {
  label: string;
  href: string; // '#' = placeholder the owner fills with a real URL
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
}

export const PROJECTS: Project[] = [
  {
    id: 'ai-invoice-studio',
    title: 'AI Invoice Studio',
    tagline: 'An invoicing tool that listens.',
    description:
      'Speak an invoice out loud — in English, Hindi, or Malayalam, even mixed mid-sentence — and it transcribes, structures, and generates a ready PDF. Real-time multilingual transcription runs through WhisperLive wrapping faster-whisper over a WebSocket connection; a fine-tuned Qwen2.5-1.5B model handles structuring the spoken invoice into line items. Frontend in React, TypeScript, and Vite; backend on Node.js with Supabase/PostgreSQL; PDFs generated with Puppeteer.',
    tags: ['React', 'TypeScript', 'Node.js', 'Supabase', 'Qwen2.5', 'WhisperLive'],
    links: [
      { label: 'repo', href: '#' },
      { label: 'live demo', href: '#' },
    ],
  },
  {
    id: 'whatsapp-bot',
    title: 'RIMS Shop WhatsApp Assistant',
    tagline: 'My own shop, automated.',
    description:
      "A WhatsApp bot that handles customer inquiries, bookings, and order status for RIMS Shop, built on Meta's Cloud API with a finite-state-machine session flow and Redis-backed conversation state. Deployed AWS-native: ECS Fargate for compute, RDS for persistence, ElastiCache for session state, an Application Load Balancer in front, Secrets Manager for credentials, and CI/CD through GitHub Actions.",
    tags: ['AWS ECS Fargate', 'Redis', 'RDS', 'Meta Cloud API', 'GitHub Actions'],
    links: [{ label: 'repo', href: '#' }],
  },
  {
    id: 'echo',
    title: 'Echo',
    tagline: 'A murder mystery that plays itself — almost.',
    description:
      'A multi-agent game built around real unsolved cold cases. A Director agent paces the story and controls pacing and reveals, NPC agents each hold their own alibi and motive and improvise consistently with it, and a Killer agent tries not to get caught under player questioning.',
    tags: ['Multi-agent systems', 'LLM orchestration'],
    links: [
      { label: 'repo', href: '#' },
      { label: 'write-up', href: '#' },
    ],
  },
];

export const PROJECT_BY_ID: Record<string, Project> = Object.fromEntries(
  PROJECTS.map((p) => [p.id, p])
);
