import { useState } from 'react';
import type { CalendarEvent } from '../types';
import { makeId } from '../utils';
import styles from './MonthEditor.module.scss';

interface Props {
  events: CalendarEvent[];
  daysInMonth: number;
  onChange: (events: CalendarEvent[]) => void;
}

export default function EventPanel({ events, daysInMonth, onChange }: Props) {
  const [dayInput, setDayInput] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [err, setErr] = useState('');

  const holidays = events.filter(e => e.isHoliday);
  const custom = events.filter(e => !e.isHoliday);
  const enabledCount = holidays.filter(h => h.enabled).length + custom.length;
  const twoCol = enabledCount + custom.length >= 8;

  const handleToggle = (id: string) => {
    onChange(events.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e));
  };

  const handleAdd = () => {
    const day = parseInt(dayInput, 10);
    const label = labelInput.trim();
    if (!label) { setErr('Enter an event name.'); return; }
    if (!day || day < 1 || day > daysInMonth) { setErr(`Day must be 1–${daysInMonth}.`); return; }
    setErr('');
    onChange([...events, { id: makeId(), day, label, isHoliday: false, enabled: true }]);
    setDayInput('');
    setLabelInput('');
  };

  const handleRemoveCustom = (id: string) => {
    onChange(events.filter(e => e.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const sortedCustom = [...custom].sort((a, b) => a.day - b.day);

  return (
    <div className={styles['month-editor__panel']}>
      <h3 className={styles['month-editor__panel-title']}>Events</h3>

      {holidays.length > 0 && (
        <ul className={`${styles['month-editor__item-list']} ${twoCol ? styles['month-editor__item-list--two-col'] : ''}`}>
          {holidays.map(h => (
            <li key={h.id} className={`${styles['month-editor__item']} ${!h.enabled ? styles['month-editor__item--disabled'] : ''}`}>
              <label className={styles['month-editor__holiday-label']}>
                <input
                  type="checkbox"
                  checked={h.enabled}
                  onChange={() => handleToggle(h.id)}
                  className={styles['month-editor__checkbox']}
                />
                <span>{h.label} — {h.day}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {sortedCustom.length > 0 && (
        <ul className={`${styles['month-editor__item-list']} ${twoCol ? styles['month-editor__item-list--two-col'] : ''}`}>
          {sortedCustom.map(c => (
            <li key={c.id} className={styles['month-editor__item']}>
              <span>{c.label} — {c.day}</span>
              <button
                className={styles['month-editor__remove-btn']}
                type="button"
                onClick={() => handleRemoveCustom(c.id)}
                aria-label={`Remove ${c.label}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles['month-editor__add-row']}>
        <input
          className={`${styles['month-editor__input']} ${styles['month-editor__input--day']}`}
          type="text"
          inputMode="numeric"
          placeholder="Day"
          value={dayInput}
          maxLength={2}
          onChange={e => setDayInput(e.target.value.replace(/\D/g, ''))}
          onKeyDown={handleKeyDown}
          aria-label="Event day"
        />
        <input
          className={`${styles['month-editor__input']} ${styles['month-editor__input--name']}`}
          type="text"
          placeholder="Event name"
          value={labelInput}
          maxLength={60}
          onChange={e => setLabelInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Event name"
        />
        <button className={styles['month-editor__add-btn']} type="button" onClick={handleAdd} aria-label="Add event">
          +
        </button>
      </div>
      {err && <p className={styles['month-editor__input-error']}>{err}</p>}
    </div>
  );
}
