import type { ChapterId } from '../data/chapters';
import { CHAPTER_ORDER } from '../data/chapters';

// ?chapter=projects&project=ai-invoice-studio  ->  deep link to a case study.
// A direct link beats "click around to find it" for a recruiter.

export function readUrl(): { chapter: ChapterId | null; project: string | null } {
  const params = new URLSearchParams(window.location.search);
  const chapterRaw = params.get('chapter');
  const projectRaw = params.get('project');
  const chapter =
    chapterRaw && (CHAPTER_ORDER as string[]).includes(chapterRaw)
      ? (chapterRaw as ChapterId)
      : null;
  const project = projectRaw || null;
  return { chapter, project };
}

export function writeUrl(chapter: ChapterId | null, project: string | null): void {
  const params = new URLSearchParams();
  if (chapter) params.set('chapter', chapter);
  if (project) params.set('project', project);
  const qs = params.toString();
  try {
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  } catch {
    /* replaceState can throw in sandboxed contexts; ignore */
  }
}
