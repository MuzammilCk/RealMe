import { CHAPTERS } from '../data/chapters';
import { usePortfolioStore } from '../store/usePortfolioStore';

// Right-edge vertical dot stack — fast-travel for someone who knows what they
// want. Visible whenever the diary is not closed. (04-COMPONENTS.md)
export default function ChapterDots() {
  const activeChapter = usePortfolioStore((s) => s.activeChapter);
  const goToChapter = usePortfolioStore((s) => s.goToChapter);

  return (
    <nav
      aria-label="Jump to chapter"
      className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3"
    >
      {CHAPTERS.map((ch) => {
        const active = activeChapter === ch.id;
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => goToChapter(ch.id)}
            aria-label={ch.title}
            aria-current={active ? 'true' : undefined}
            className={`h-2.5 w-2.5 rounded-full border border-brass transition-colors ${
              active ? 'bg-brass' : 'bg-transparent hover:bg-brass/50'
            }`}
          />
        );
      })}
    </nav>
  );
}
