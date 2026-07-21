import { PROJECT_BY_ID } from '../data/projects';
import { usePortfolioStore } from '../store/usePortfolioStore';
import BookSpread from './BookSpread';

// Expanded project view — anchored in the spread (not a modal), so the
// "reading a page" feeling holds. Back returns to the Projects chapter.
export default function ProjectDetail() {
  const activeProject = usePortfolioStore((s) => s.activeProject);
  const closeProject = usePortfolioStore((s) => s.closeProject);
  const p = activeProject ? PROJECT_BY_ID[activeProject] : null;
  if (!p) return null;

  const left = (
    <>
      <p className="eyebrow-mini">03 — Projects</p>
      <h3 className="page-title">{p.title}</h3>
      <p className="tagline">{p.tagline}</p>
      <p className="body-copy">{p.description}</p>
    </>
  );
  const right = (
    <>
      <div className="mb-5">
        {p.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      {p.links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          className="cta mr-2"
          target="_blank"
          rel="noreferrer noopener"
        >
          {l.label} ↗
        </a>
      ))}
      <div className="mt-6">
        <button type="button" className="cta" onClick={closeProject}>
          ← All projects
        </button>
      </div>
    </>
  );

  return <BookSpread left={left} right={right} />;
}
