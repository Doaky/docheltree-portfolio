import { Link } from 'react-router-dom';
import styles from './ProjectsList.module.scss';
import { CATEGORY_ORDER, getProjectsByCategory } from '../../data/projects';
import type { Project } from '../../data/projects';
import SEO from '../../components/SEO/SEO';

function ProjectRow({ project }: { project: Project }) {
  const to = project.appRoute ?? `/projects/${project.category}/${project.slug}`;
  return (
    <Link className={styles['projects__row']} to={to}>
      <div className={styles['projects__row-top']}>
        <span className={styles['projects__row-slug']}>{project.slug}/</span>
        <span className={styles['projects__row-title']}>{project.title}</span>
        <span className={styles['projects__row-date']}>{project.date ?? '—'}</span>
        <span className={styles['projects__row-arrow']} aria-hidden="true">⤳</span>
      </div>
      {project.shortDescription && (
        <p className={styles['projects__row-desc']}>{project.shortDescription}</p>
      )}
    </Link>
  );
}

interface Props {
  theme?: React.CSSProperties;
  hideSEO?: boolean;
}

export default function ProjectsList({ theme, hideSEO }: Props) {
  return (
    <main className={styles.projects} style={theme}>
      {!hideSEO && (
        <SEO title="Projects" description="All projects by Daniel Ocheltree — web apps, documentation, and crafts." />
      )}

      <header className={styles['projects__header']}>
        <Link to="/" className={styles['projects__back-link']}>⬿ home</Link>
        <span className={styles['projects__path-label']}>~/projects</span>
      </header>

      <div className={styles['projects__divider']} aria-hidden="true">{'/'.repeat(200)}</div>

      {CATEGORY_ORDER.map(category => {
        const projects = getProjectsByCategory(category);
        if (projects.length === 0) return null;
        return (
          <section key={category} className={styles['projects__category-section']}>
            <p className={styles['projects__category-label']} aria-hidden="true">{`<!-- ${category} -->`}</p>
            <div className={styles['projects__row-list']}>
              {projects.map(project => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
