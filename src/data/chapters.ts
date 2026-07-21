// Content only — no JSX. Every string is verbatim from 03-CONTENT-STORYLINE.md.
// [bracketed] items are placeholders for the owner to fill; nothing invented.

export type ChapterId = 'about' | 'skills' | 'projects' | 'experience' | 'contact';

export interface Chapter {
  id: ChapterId;
  num: string; // '01' … '05' — numbered because a life story is an ordered sequence
  title: string;
}

export const CHAPTERS: Chapter[] = [
  { id: 'about', num: '01', title: 'About' },
  { id: 'skills', num: '02', title: 'Skills' },
  { id: 'projects', num: '03', title: 'Projects' },
  { id: 'experience', num: '04', title: 'Experience' },
  { id: 'contact', num: '05', title: 'Contact' },
];

export const CHAPTER_ORDER: ChapterId[] = CHAPTERS.map((c) => c.id);

// --- Intro spread: left page "My Story" (first 3 paragraphs) + CTA ---
export const STORY_INTRO = {
  eyebrow: 'My Story',
  // The diary-open spread shows the first three paragraphs; the About chapter adds the fourth.
  paragraphs: [
    "I'm a final-year Computer Science student at KTU, and for the last few years I've been doing two things most people keep separate: writing production software, and running a small hardware business.",
    'By day I build full-stack systems — React frontends, Node and Python backends, AI pipelines, cloud infrastructure on AWS. On the side, I run RIMS Shop, selling, installing, and repairing speakers and audio systems, which means I’ve spent about as much time with a soldering iron as with a keyboard.',
    'That combination shows up in how I build: I care whether the thing actually works end to end, not just whether the demo does. This diary is where I keep the record.',
  ],
  cta: 'Explore My Journey →',
};

// --- Chapter 01 — About (the three intro paragraphs + one more) ---
export const ABOUT = {
  eyebrow: 'About',
  paragraphs: [
    ...STORY_INTRO.paragraphs,
    "KTU's final year has meant balancing coursework, placement interviews, and shipping real projects at the same time — which turned out to be its own lesson in prioritization. The three projects in this diary aren't class assignments. They're things I built because I wanted them to exist and then to actually work.",
  ],
};

// --- Chapter 04 — Experience ---
export const EXPERIENCE = {
  eyebrow: 'Experience',
  paragraphs: [
    'Final-year B.Tech, Computer Science — KTU, graduating [2026/2027].',
    "One recent habit worth mentioning: I've started running full production-style audits on my own projects before calling them done — the kind of scrutiny you'd normally only get from a senior engineer's code review. It's slower than declaring victory early, and it's taught me more about what \"production-grade\" actually means than any tutorial has.",
  ],
};

// --- Chapter 05 — Contact (styled as a closing letter, not a form) ---
export const CONTACT = {
  eyebrow: 'Contact',
  lead: "If you've read this far — thank you. I'm looking for software engineering roles where I can work across the stack, and I'd like to talk about what I could build for your team.",
  // Placeholders — replace with real links.
  email: 'your.email@example.com',
  github: 'github.com/yourhandle',
  linkedin: 'linkedin.com/in/yourhandle',
  cta: 'Say hello →',
};

// Cover / intro chrome
export const COVER = {
  title: 'MY JOURNEY',
  subtitle: '— A LOG OF THINGS I’VE BUILT —',
  nameplate: 'Hello, I’m — [YOUR NAME]',
  eyebrow: 'SOFTWARE ENGINEER · KTU',
  hint: 'click the diary to begin',
};

// Sticky notes scattered on the table (decorative, intro state only)
export const STICKY_NOTES = [
  { text: 'ship it', near: 'pen' },
  { text: 'coffee first', near: 'mug' },
];
