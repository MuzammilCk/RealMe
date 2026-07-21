import { STORY_INTRO } from '../data/chapters';
import { usePortfolioStore } from '../store/usePortfolioStore';
import BookSpread from './BookSpread';
import ChapterNav from './ChapterNav';

// Intro spread: left = "My Story", right = chapter nav.
export default function Spread() {
  const goToChapter = usePortfolioStore((s) => s.goToChapter);

  const left = (
    <>
      <p className="eyebrow-mini">{STORY_INTRO.eyebrow}</p>
      {STORY_INTRO.paragraphs.map((p, i) => (
        <p key={i} className="body-copy">
          {p}
        </p>
      ))}
      <button type="button" className="cta" onClick={() => goToChapter('about')}>
        {STORY_INTRO.cta}
      </button>
    </>
  );

  const right = (
    <>
      <p className="eyebrow-mini">Chapters</p>
      <ChapterNav />
    </>
  );

  return <BookSpread left={left} right={right} />;
}
