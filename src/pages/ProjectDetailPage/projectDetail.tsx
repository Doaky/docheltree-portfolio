import { useParams, Link } from 'react-router-dom';
import styles from './projectDetail.module.scss';
import {
  isProjectCategory,
  getProjectBySlug,
  CATEGORY_LABELS,
} from '../../data/projects';

function ProjectDetailPage() {
  const { category = '', slug = '' } = useParams<{ category: string; slug: string }>();

  const project =
    isProjectCategory(category) ? getProjectBySlug(category, slug) : undefined;

  if (!project) {
    return (
      <main className={styles.main}>
        <Link to="/projects" className={styles.backLink}>← back to projects</Link>
        <p>Project not found.</p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Link to="/projects" className={styles.backLink}>← back to projects</Link>

      <p className={styles.category}>{CATEGORY_LABELS[project.category]}</p>
      <h1 className={styles.title}>{project.title}</h1>
      {project.date && <p className={styles.date}>{project.date}</p>}

      {project.image && (
        <img src={project.image} alt={project.title} className={styles.image} />
      )}

      <p className={styles.description}>{project.fullDescription}</p>

      {project.appRoute && (
        <Link to={project.appRoute} className={styles.launchLink}>
          Launch App →
        </Link>
      )}

      {project.links && project.links.length > 0 && (
        <ul className={styles.links}>
          {project.links.map(link => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {project.tags && project.tags.length > 0 && (
        <ul className={styles.tags}>
          {project.tags.map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default ProjectDetailPage;
