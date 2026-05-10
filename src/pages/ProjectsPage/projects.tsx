import ProjectsList from './ProjectsList';
import { useGrain } from '../../hooks/useGrain';

const theme: React.CSSProperties = {
  '--bg':          '#243c2f',
  '--text':        '#fff4e4',
  '--text-dim':    '#eac1b8',
  '--accent':      '#dfb161',
  '--accent-hover':'#edc97a',
  '--border':      '#0f1208',
  '--row-hover':   'rgba(223, 177, 97, 0.1)',
} as React.CSSProperties;

export default function Projects() {
  useGrain();
  return <ProjectsList theme={theme} />;
}
