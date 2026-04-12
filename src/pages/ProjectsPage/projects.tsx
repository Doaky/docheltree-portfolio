import { Link } from 'react-router-dom';
import styles from './projects.module.scss';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { CATEGORY_ORDER, CATEGORY_LABELS, getProjectsByCategory } from '../../data/projects';

function Projects() {
  return (
    <main className={styles.main}>
      <div className={styles.multiHeader}>
        <h1>projects</h1>
        <h1>projects</h1>
        <h1>projects</h1>
      </div>

      <div>
        <Link to="/">back to home</Link>
      </div>

      {CATEGORY_ORDER.map(category => (
        <div key={category} className={styles.projectEntriesWrapper}>
          <div className={styles.projectGroupTitleWrapper}>
            <h2 className={styles.projectGroupTitle}>{CATEGORY_LABELS[category]}</h2>
          </div>
          <section className={styles.projectGroup}>
            {getProjectsByCategory(category).map(project => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </section>
        </div>
      ))}
    </main>
  );
}

export default Projects;
