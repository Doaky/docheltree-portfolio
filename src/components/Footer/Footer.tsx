import kofiImg from '../../assets/support_me_on_kofi_red.png';
import styles from './Footer.module.scss';

interface FooterProps {
  projectSlug: string;
  className?: string;
}

export default function Footer({ projectSlug, className }: FooterProps) {
  return (
    <footer className={`${styles.footer}${className ? ` ${className}` : ''}`}>
      <div className={styles['footer__inner']}>
        <div className={styles['footer__feedback']}>
          <span className={styles['footer__prompt']}>Feedback or Feature Request?</span>
          <a
            href={`mailto:danielocheltree+${projectSlug}@gmail.com?subject=${projectSlug} Feedback`}
            className={styles['footer__email']}
          >
            danielocheltree@gmail.com
          </a>
        </div>
        <a
          href="https://ko-fi.com/danielocheltree"
          target="_blank"
          rel="noopener noreferrer"
          className={styles['footer__kofi']}
        >
          <img src={kofiImg} alt="Support me on Ko-fi" className={styles['footer__kofi-img']} />
        </a>
      </div>
    </footer>
  );
}
