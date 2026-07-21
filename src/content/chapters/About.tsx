import { ABOUT } from '../../data/chapters';
import BookSpread from '../BookSpread';

// Chapter 01 — About. The three intro paragraphs + one more, split across pages.
export default function About() {
  const left = (
    <>
      <p className="eyebrow-mini">{ABOUT.eyebrow}</p>
      {ABOUT.paragraphs.slice(0, 2).map((p, i) => (
        <p key={i} className="body-copy">
          {p}
        </p>
      ))}
    </>
  );
  const right = ABOUT.paragraphs.slice(2).map((p, i) => (
    <p key={i} className="body-copy">
      {p}
    </p>
  ));

  return <BookSpread left={left} right={right} />;
}
