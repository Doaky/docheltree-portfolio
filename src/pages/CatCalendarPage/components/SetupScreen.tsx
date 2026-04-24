import { useState } from 'react';
import styles from './SetupScreen.module.scss';

interface Props {
  initialUnit: 'F' | 'C';
  initialZip?: string;
  loading: boolean;
  error: string | null;
  onComplete: (zip: string, unit: 'F' | 'C') => void;
  onSkip: (unit: 'F' | 'C') => void;
}

const LOADING_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export default function SetupScreen({ initialUnit, initialZip, loading, error, onComplete, onSkip }: Props) {
  const [zip, setZip] = useState(() =>
    initialZip && initialZip !== 'skipped' ? initialZip : ''
  );
  const [unit, setUnit] = useState<'F' | 'C'>(initialUnit);
  const [frame, setFrame] = useState(0);

  // Animate spinner when loading
  useState(() => {
    if (!loading) return;
    const id = setInterval(() => setFrame(f => (f + 1) % LOADING_FRAMES.length), 100);
    return () => clearInterval(id);
  });

  const canSubmit = zip.length === 5 && /^\d{5}$/.test(zip) && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onComplete(zip, unit);
  };

  return (
    <div className={styles['setup-screen']}>
      <h1 className={styles['setup-screen__title']}>Cat Calendar</h1>
      <p className={styles['setup-screen__subtitle']}>Build a 12-month printable calendar with your own cats.</p>

      <form className={styles['setup-screen__form']} onSubmit={handleSubmit}>
        <div className={styles['setup-screen__field']}>
          <label className={styles['setup-screen__label']} htmlFor="zip">Your ZIP code (for weather averages)</label>
          <input
            id="zip"
            className={styles['setup-screen__input']}
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="e.g. 10001"
            value={zip}
            onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            autoComplete="postal-code"
          />
        </div>

        <div className={styles['setup-screen__field']}>
          <span className={styles['setup-screen__label']}>Temperature unit</span>
          <div className={styles['setup-screen__toggle-group']}>
            <button
              type="button"
              className={`${styles['setup-screen__toggle-btn']} ${unit === 'F' ? styles['setup-screen__toggle-btn--active'] : ''}`}
              onClick={() => setUnit('F')}
            >
              °F
            </button>
            <button
              type="button"
              className={`${styles['setup-screen__toggle-btn']} ${unit === 'C' ? styles['setup-screen__toggle-btn--active'] : ''}`}
              onClick={() => setUnit('C')}
            >
              °C
            </button>
          </div>
        </div>

        <button type="submit" className={styles['setup-screen__build-btn']} disabled={!canSubmit}>
          {loading ? `${LOADING_FRAMES[frame]} Fetching weather…` : 'Build my calendar →'}
        </button>

        {error && <p className={styles['setup-screen__error-row']}>{error}</p>}

        <div className={styles['setup-screen__loading-row']}>
          {loading && 'Looking up weather data for your area…'}
        </div>

        <button type="button" className={styles['setup-screen__skip-note']} onClick={() => onSkip(unit)}>
          Skip weather data and start without it
        </button>
      </form>
    </div>
  );
}
