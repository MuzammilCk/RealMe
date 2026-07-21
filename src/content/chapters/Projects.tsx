import { PROJECTS } from '../../data/projects';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import BookSpread from '../BookSpread';
import ProjectCard from '../ProjectCard';

// Chapter 03 — Projects. Three polaroid cards, most distinctive first.
export default function Projects() {
  const openProject = usePortfolioStore((s) => s.openProject);

  const left = (
    <>
      <p className="eyebrow-mini">03 — Projects</p>
      <ProjectCard project={PROJECTS[0]} onOpen={openProject} />
    </>
  );
  const right = (
    <>
      <ProjectCard project={PROJECTS[1]} onOpen={openProject} />
      <ProjectCard project={PROJECTS[2]} onOpen={openProject} />
    </>
  );

  return <BookSpread left={left} right={right} />;
}
