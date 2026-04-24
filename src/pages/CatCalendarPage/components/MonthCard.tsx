import { MONTH_NAMES, DAYS_IN_MONTH, WEATHER_LABEL_TEXT, CAT_PARTS, CAT_PART_LABELS, PLACEHOLDER_COLORS, USING_PLACEHOLDERS } from '../constants';
import { formatTemp } from '../utils';
import type { MonthData } from '../types';
import styles from './MonthCard.module.scss';

interface Props {
  monthData: MonthData;
  tempUnit: 'F' | 'C';
  onClick?: () => void;
  isPrintView?: boolean;
}

export default function MonthCard({ monthData, tempUnit, onClick, isPrintView }: Props) {
  const { monthIndex, weather, cat, birthdays, events } = monthData;
  const days = DAYS_IN_MONTH[monthIndex];

  const high = formatTemp(weather.avgHighF, tempUnit);
  const low = formatTemp(weather.avgLowF, tempUnit);
  const weatherText = weather.label ? WEATHER_LABEL_TEXT[weather.label] : null;

  const sortedBirthdays = [...birthdays].sort((a, b) => a.day - b.day);
  const visibleEvents = events.filter(e => e.enabled).sort((a, b) => a.day - b.day);

  const bdayTwoCol = sortedBirthdays.length >= 8;
  const eventTwoCol = visibleEvents.length >= 8;

  return (
    <div
      className={`${styles.card} ${onClick && !isPrintView ? styles.clickable : ''}`}
      onClick={!isPrintView ? onClick : undefined}
      role={onClick && !isPrintView ? 'button' : undefined}
      tabIndex={onClick && !isPrintView ? 0 : undefined}
      onKeyDown={onClick && !isPrintView ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {/* Header */}
      <div className={styles.cardHeader}>
        <span className={styles.cardMonth}>{MONTH_NAMES[monthIndex]}</span>
        <div className={styles.cardMetaRow}>
          <span className={styles.cardMeta}>{days} days</span>
          {weather.avgHighF !== null && (
            <span className={styles.cardMeta}>{high} / {low}</span>
          )}
          {weatherText && <span className={styles.cardMeta}>{weatherText}</span>}
        </div>
      </div>

      {/* T-table */}
      <div className={styles.cardTable}>
        <div className={styles.cardCol}>
          <div className={styles.colLabel}>Birthdays</div>
          {sortedBirthdays.length > 0 ? (
            <ul className={`${styles.entryList} ${bdayTwoCol ? styles.twoCol : ''}`}>
              {sortedBirthdays.map(b => (
                <li key={b.id}>{b.name} — {b.day}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.emptyNote}>—</span>
          )}
        </div>
        <div className={styles.colDivider} />
        <div className={styles.cardCol}>
          <div className={styles.colLabel}>Events</div>
          {visibleEvents.length > 0 ? (
            <ul className={`${styles.entryList} ${eventTwoCol ? styles.twoCol : ''}`}>
              {visibleEvents.map(e => (
                <li key={e.id}>{e.label} — {e.day}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.emptyNote}>—</span>
          )}
        </div>
      </div>

      {/* Cat */}
      <div className={styles.catArea}>
        {USING_PLACEHOLDERS ? (
          <div className={styles.catPlaceholder}>
            {CAT_PARTS.map(part => (
              <div
                key={part}
                className={styles.catPlaceholderChip}
                style={{ background: PLACEHOLDER_COLORS[part] }}
              >
                {CAT_PART_LABELS[part]} {cat[part]}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.catStack}>
            {CAT_PARTS.map(part => (
              <img
                key={part}
                className={styles.catLayerImg}
                src={`/cats/${part}/${part}-${cat[part]}.png`}
                alt=""
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
