# Content & Storyline

Every string that appears in the live draft comes from this file. `[bracketed]` items are placeholders only you can fill in — I'm not going to invent an email address, a GitHub handle, or a graduation year on your behalf.

## Cover

**Title:** MY JOURNEY
**Subtitle (mono, small, beneath title):** — A LOG OF THINGS I'VE BUILT —
**Nameplate prop text:** Hello, I'm — [YOUR NAME]
**Eyebrow (top-left, intro state only):** SOFTWARE ENGINEER · KTU
**Hint (bottom-center, intro state only, pulses gently):** click the diary to begin

## Left page, diary-open spread — "My Story"

> I'm a final-year Computer Science student at KTU, and for the last few years I've been doing two things most people keep separate: writing production software, and running a small hardware business.
>
> By day I build full-stack systems — React frontends, Node and Python backends, AI pipelines, cloud infrastructure on AWS. On the side, I run RIMS Shop, selling, installing, and repairing speakers and audio systems, which means I've spent about as much time with a soldering iron as with a keyboard.
>
> That combination shows up in how I build: I care whether the thing actually works end to end, not just whether the demo does. This diary is where I keep the record.

**Button:** Explore My Journey →

## Right page — Chapters (the nav)

```
01  About
02  Skills
03  Projects
04  Experience
05  Contact
```

## Chapter 01 — About

Same "My Story" copy as the spread's left page, expanded with one more paragraph:

> KTU's final year has meant balancing coursework, placement interviews, and shipping real projects at the same time — which turned out to be its own lesson in prioritization. The three projects in this diary aren't class assignments. They're things I built because I wanted them to exist and then to actually work.

## Chapter 02 — Skills

Presented as tagged category cards, not a wall of text — mono labels, brass border on hover.

**Frontend** — React · TypeScript · Vite · Tailwind CSS
**Backend** — Node.js · Python · FSM-driven service design
**AI / ML** — Model fine-tuning (Qwen2.5-1.5B) · Real-time multilingual speech-to-text (WhisperLive + faster-whisper) · Multi-agent system design
**Cloud / DevOps** — AWS (ECS Fargate, RDS, ElastiCache, ALB, Secrets Manager) · GitHub Actions CI/CD
**Data** — PostgreSQL, Supabase · Redis

## Chapter 03 — Projects

Three cards, polaroid-framed per the mockup's visual language. Order: most technically distinctive first.

---
**AI Invoice Studio**
*An invoicing tool that listens.*

> Speak an invoice out loud — in English, Hindi, or Malayalam, even mixed mid-sentence — and it transcribes, structures, and generates a ready PDF. Real-time multilingual transcription runs through WhisperLive wrapping faster-whisper over a WebSocket connection; a fine-tuned Qwen2.5-1.5B model handles structuring the spoken invoice into line items. Frontend in React, TypeScript, and Vite; backend on Node.js with Supabase/PostgreSQL; PDFs generated with Puppeteer.

Tags: `React` `TypeScript` `Node.js` `Supabase` `Qwen2.5` `WhisperLive`
Links: `[repo]` `[live demo]`

---
**RIMS Shop WhatsApp Assistant**
*My own shop, automated.*

> A WhatsApp bot that handles customer inquiries, bookings, and order status for RIMS Shop, built on Meta's Cloud API with a finite-state-machine session flow and Redis-backed conversation state. Deployed AWS-native: ECS Fargate for compute, RDS for persistence, ElastiCache for session state, an Application Load Balancer in front, Secrets Manager for credentials, and CI/CD through GitHub Actions.

Tags: `AWS ECS Fargate` `Redis` `RDS` `Meta Cloud API` `GitHub Actions`
Links: `[repo]`

---
**Echo**
*A murder mystery that plays itself — almost.*

> A multi-agent game built around real unsolved cold cases. A Director agent paces the story and controls pacing and reveals, NPC agents each hold their own alibi and motive and improvise consistently with it, and a Killer agent tries not to get caught under player questioning.

Tags: `Multi-agent systems` `LLM orchestration`
Links: `[repo]` `[write-up]`

---

## Chapter 04 — Experience

> **Final-year B.Tech, Computer Science — KTU**, graduating [2026/2027].

> One recent habit worth mentioning: I've started running full production-style audits on my own projects before calling them done — the kind of scrutiny you'd normally only get from a senior engineer's code review. It's slower than declaring victory early, and it's taught me more about what "production-grade" actually means than any tutorial has.

*(Optional, your call: this is where a short, honest note about auditing one of your own AI pipelines and rebuilding it properly could go, without getting into the specific bugs — the discipline is the point, not the postmortem. Tell me if you want that written out and I'll draft it.)*

## Chapter 05 — Contact

Styled as a closing letter, not a form.

> If you've read this far — thank you. I'm looking for software engineering roles where I can work across the stack, and I'd like to talk about what I could build for your team.
>
> [your.email@example.com] · [github.com/yourhandle] · [linkedin.com/in/yourhandle]

**Button:** Say hello →

## Sticky notes (scattered on the table, decorative, intro state)

- "ship it" (small, tilted, near the pen)
- "coffee first" (near the mug)
