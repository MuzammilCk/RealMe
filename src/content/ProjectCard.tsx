import type { Project } from '../data/projects';

// Polaroid-framed card. Click expands in place to ProjectDetail (no route change).
export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className="project-card block w-full text-left"
      onClick={() => onOpen(project.id)}
      aria-label={`Open project: ${project.title}`}
    >
      <h3 className="page-title">{project.title}</h3>
      <p className="tagline">{project.tagline}</p>
      <div>
        {project.tags.slice(0, 3).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
    </button>
  );
}
