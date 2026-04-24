import styles from './DevPage.module.scss';
import ProjectsList from '../ProjectsPage/ProjectsList';

// ── Color themes ──────────────────────────────────────
const SAGE: React.CSSProperties = {
  '--bg':          '#0C150E',
  '--text':        '#C9E8C0',
  '--text-dim':    '#6A9870',
  '--accent':      '#4DB37D',
  '--accent-hover':'#6FCC9A',
  '--border':      '#1E3322',
  '--row-hover':   'rgba(77, 179, 125, 0.08)',
} as React.CSSProperties;

const MOSS: React.CSSProperties = {
  '--bg':          '#0F1208',
  '--text':        '#C8D87A',
  '--text-dim':    '#7A8A3A',
  '--accent':      '#9AB820',
  '--accent-hover':'#B8D830',
  '--border':      '#252E0A',
  '--row-hover':   'rgba(154, 184, 32, 0.08)',
} as React.CSSProperties;

const EMERALD: React.CSSProperties = {
  '--bg':          '#031A0E',
  '--text':        '#A8EFD0',
  '--text-dim':    '#4A9E78',
  '--accent':      '#00C97A',
  '--accent-hover':'#20E894',
  '--border':      '#0A3820',
  '--row-hover':   'rgba(0, 201, 122, 0.08)',
} as React.CSSProperties;

const EMBER: React.CSSProperties = {
  '--bg':          '#1A0C02',
  '--text':        '#F0C87A',
  '--text-dim':    '#9A7030',
  '--accent':      '#E06820',
  '--accent-hover':'#F08840',
  '--border':      '#3A1E08',
  '--row-hover':   'rgba(224, 104, 32, 0.08)',
} as React.CSSProperties;

const SECTIONS = [
  { id: 'theme-sage',    label: 'Sage',    theme: SAGE,    desc: 'dark forest — soft mint' },
  { id: 'theme-moss',    label: 'Moss',    theme: MOSS,    desc: 'dark olive — yellow-green' },
  { id: 'theme-emerald', label: 'Emerald', theme: EMERALD, desc: 'deep emerald — bright aqua' },
  { id: 'theme-ember',   label: 'Ember',   theme: EMBER,   desc: 'dark brown — burnt orange' },
];

export default function DevPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.devPage}>
      <nav className={styles.stickyNav} aria-label="Theme navigation">
        <span className={styles.navLabel}>projects — color themes</span>
        {SECTIONS.map(s => (
          <button key={s.id} className={styles.navBtn} onClick={() => scrollTo(s.id)}>
            {s.label}
          </button>
        ))}
        <a href="/projects" className={styles.navBack}>⤳ go live</a>
      </nav>

      {SECTIONS.map(s => (
        <div key={s.id} id={s.id} className={styles.variantSection}>
          <div className={styles.variantLabel} aria-hidden="true">
            ── {s.label}: {s.desc} ──
          </div>
          <ProjectsList theme={s.theme} hideSEO />
        </div>
      ))}
    </div>
  );
}
