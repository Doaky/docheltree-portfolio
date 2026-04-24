import type { CalendarState } from '../types';
import MonthCard from './MonthCard';
import styles from './SummaryScreen.module.scss';

interface Props {
  calState: CalendarState;
  onEditMonth: (monthIndex: number) => void;
  onEditSetup: () => void;
  onStartOver: () => void;
  onCopyLink: () => void;
  copySuccess: boolean;
}

export default function SummaryScreen({
  calState,
  onEditMonth,
  onEditSetup,
  onStartOver,
  onCopyLink,
  copySuccess,
}: Props) {
  const { setup, months } = calState;
  const hasZip = setup.zipCode && setup.zipCode !== 'skipped';

  return (
    <div className={styles.summary}>

      {/* Title + primary actions */}
      <div className={styles.summaryTop}>
        <h2 className={styles.summaryTitle}>Your Calendar</h2>
        <div className={styles.summaryActions}>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={() => window.print()}
          >
            Print Calendar
          </button>
          <button className={styles.actionBtn} onClick={onCopyLink}>
            {copySuccess ? 'Copied!' : 'Copy Share Link'}
          </button>
        </div>
      </div>

      {/* Weather info row */}
      <div className={styles.weatherRow}>
        {hasZip ? (
          <span className={styles.weatherInfo}>
            Weather data for ZIP {setup.zipCode} — temperatures in °{setup.tempUnit}
          </span>
        ) : (
          <span className={styles.weatherInfo}>No weather data loaded.</span>
        )}
        <button className={styles.editSetupBtn} onClick={onEditSetup}>
          Edit ZIP / unit
        </button>
      </div>

      {/* Interactive month grid */}
      <div className={styles.screenGrid}>
        {months.map(m => (
          <MonthCard
            key={m.monthIndex}
            monthData={m}
            tempUnit={setup.tempUnit}
            onClick={() => onEditMonth(m.monthIndex)}
          />
        ))}
      </div>

      {/* Print-only layout — hidden on screen, two landscape pages of 6 months each */}
      <div className={styles.printRoot} aria-hidden="true">
        <div className={styles.printPage}>
          {months.slice(0, 6).map(m => (
            <MonthCard key={m.monthIndex} monthData={m} tempUnit={setup.tempUnit} isPrintView />
          ))}
        </div>
        <div className={styles.printPage}>
          {months.slice(6, 12).map(m => (
            <MonthCard key={m.monthIndex} monthData={m} tempUnit={setup.tempUnit} isPrintView />
          ))}
        </div>
      </div>

      <div className={styles.startOverRow}>
        <button className={styles.startOverBtn} onClick={onStartOver}>
          Start over with a new calendar
        </button>
      </div>
    </div>
  );
}
