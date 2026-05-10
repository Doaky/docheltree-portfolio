import { useParams, Link } from 'react-router-dom';
import styles from './projectDetail.module.scss';
import {
  isProjectCategory,
  getProjectBySlug,
  CATEGORY_LABELS,
} from '../../data/projects';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import SEO from '../../components/SEO/SEO';

function ProjectDetailPage() {
  const { category = '', slug = '' } = useParams<{ category: string; slug: string }>();

  const project =
    isProjectCategory(category) ? getProjectBySlug(category, slug) : undefined;

  if (!project) {
    return (
      <div className={styles['project-detail']}>
        <NavBar title="Project Not Found" className={styles['project-detail__nav']} />
        <main className={styles['project-detail__content']}>
          <p>Project not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles['project-detail']}>
      <SEO title={project.title} description={project.shortDescription} bare={project.category === 'web-apps'} />
      <NavBar title={project.title} className={styles['project-detail__nav']} />

      <main className={styles['project-detail__content']}>
        <p className={styles['project-detail__category']}>{CATEGORY_LABELS[project.category]}</p>
        <h1 className={styles['project-detail__title']}>{project.title}</h1>
        {project.date && <p className={styles['project-detail__date']}>{project.date}</p>}

        {project.image && (
          <img src={project.image} alt={project.title} className={styles['project-detail__image']} />
        )}

        <p className={styles['project-detail__description']}>{project.fullDescription}</p>

        {project.appRoute && (
          <Link to={project.appRoute} className={styles['project-detail__launch-link']}>
            Launch App →
          </Link>
        )}

        {project.links && project.links.length > 0 && (
          <ul className={styles['project-detail__links']}>
            {project.links.map(link => (
              <li key={link.url} className={styles['project-detail__link-item']}>
                <a href={link.url} className={styles['project-detail__link-anchor']} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {project.tags && project.tags.length > 0 && (
          <ul className={styles['project-detail__tags']}>
            {project.tags.map(tag => (
              <li key={tag} className={styles['project-detail__tag']}>{tag}</li>
            ))}
          </ul>
        )}
      </main>

      {project.category === 'documentation' && (
        <Footer projectSlug={project.slug} className={styles['project-detail__footer']} />
      )}
    </div>
  );
}

export default ProjectDetailPage;
