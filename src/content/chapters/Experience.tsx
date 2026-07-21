import { EXPERIENCE } from '../../data/chapters';
import BookSpread from '../BookSpread';

// Chapter 04 — Experience.
export default function Experience() {
  const left = (
    <>
      <p className="eyebrow-mini">{EXPERIENCE.eyebrow}</p>
      {EXPERIENCE.paragraphs.slice(0, 1).map((p, i) => (
        <p key={i} className="body-copy">
          {p}
        </p>
      ))}
    </>
  );
  const right = EXPERIENCE.paragraphs.slice(1).map((p, i) => (
    <p key={i} className="body-copy">
      {p}
    </p>
  ));

  return <BookSpread left={left} right={right} />;
}
