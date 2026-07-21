import { SKILLS } from '../../data/skills';
import BookSpread from '../BookSpread';

// Chapter 02 — Skills, as tagged category cards (mono labels, brass border on hover).
export default function Skills() {
  const card = (cat: string, items: string) => (
    <div className="skill-card">
      <span className="skill-cat">{cat}</span>
      <span className="skill-items">{items}</span>
    </div>
  );

  const left = (
    <>
      <p className="eyebrow-mini">02 — Skills</p>
      {SKILLS.slice(0, 3).map((s) => (
        <div key={s.cat}>{card(s.cat, s.items)}</div>
      ))}
    </>
  );
  const right = SKILLS.slice(3).map((s) => <div key={s.cat}>{card(s.cat, s.items)}</div>);

  return <BookSpread left={left} right={right} />;
}
