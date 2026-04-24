import { MONTH_NAMES, DAYS_IN_MONTH, WEATHER_LABEL_TEXT } from '../constants';
import { formatTemp } from '../utils';
import type { MonthWeather } from '../types';
import styles from './MonthEditor.module.scss';

interface Props {
  monthIndex: number;
  weather: MonthWeather;
  tempUnit: 'F' | 'C';
}

export default function MonthHeader({ monthIndex, weather, tempUnit }: Props) {
  const days = DAYS_IN_MONTH[monthIndex];
  const high = formatTemp(weather.avgHighF, tempUnit);
  const low = formatTemp(weather.avgLowF, tempUnit);
  const weatherText = weather.label ? WEATHER_LABEL_TEXT[weather.label] : '—';

  return (
    <div className={styles['month-editor__month-header']}>
      <span className={styles['month-editor__header-month']}>{MONTH_NAMES[monthIndex]}</span>
      <span className={styles['month-editor__header-sep']}>|</span>
      <span className={styles['month-editor__header-days']}>{days} days</span>
      <span className={styles['month-editor__header-sep']}>|</span>
      <span className={styles['month-editor__header-temp']}>
        {high} / {low}
      </span>
      <span className={styles['month-editor__header-sep']}>|</span>
      <span className={styles['month-editor__header-weather']}>{weatherText}</span>
    </div>
  );
}
