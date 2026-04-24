import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.scss';
import type { Project } from '../../data/projects';

interface Props {
  project: Project;
}

function ProjectCard({ project }: Props) {
  const to = project.appRoute ?? `/projects/${project.category}/${project.slug}`;

  return (
    <Link className={styles.card} to={to}>
      {project.image && (
        <img className={styles['card__image']} src={project.image} alt={project.title} />
      )}
      <h3 className={styles['card__title']}>{project.title}</h3>
      {project.date && <p className={styles['card__date']}>{project.date}</p>}
      <p className={styles['card__description']}>{project.shortDescription}</p>
    </Link>
  );
}

export default ProjectCard;
