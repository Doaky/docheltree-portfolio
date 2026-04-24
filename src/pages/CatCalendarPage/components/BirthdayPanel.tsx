import { useState } from 'react';
import type { Birthday } from '../types';
import { makeId } from '../utils';
import styles from './MonthEditor.module.scss';

interface Props {
  birthdays: Birthday[];
  daysInMonth: number;
  onChange: (birthdays: Birthday[]) => void;
}

export default function BirthdayPanel({ birthdays, daysInMonth, onChange }: Props) {
  const [dayInput, setDayInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [err, setErr] = useState('');

  const sorted = [...birthdays].sort((a, b) => a.day - b.day);
  const twoCol = sorted.length >= 8;

  const handleAdd = () => {
    const day = parseInt(dayInput, 10);
    const name = nameInput.trim();
    if (!name) { setErr('Enter a name.'); return; }
    if (!day || day < 1 || day > daysInMonth) { setErr(`Day must be 1–${daysInMonth}.`); return; }
    setErr('');
    onChange([...birthdays, { id: makeId(), day, name }]);
    setDayInput('');
    setNameInput('');
  };

  const handleRemove = (id: string) => {
    onChange(birthdays.filter(b => b.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className={styles['month-editor__panel']}>
      <h3 className={styles['month-editor__panel-title']}>Birthdays</h3>

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
          aria-label="Birthday day"
        />
        <input
          className={`${styles['month-editor__input']} ${styles['month-editor__input--name']}`}
          type="text"
          placeholder="Name"
          value={nameInput}
          maxLength={40}
          onChange={e => setNameInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Birthday name"
        />
        <button className={styles['month-editor__add-btn']} type="button" onClick={handleAdd} aria-label="Add birthday">
          +
        </button>
      </div>
      {err && <p className={styles['month-editor__input-error']}>{err}</p>}

      {sorted.length > 0 && (
        <ul className={`${styles['month-editor__item-list']} ${twoCol ? styles['month-editor__item-list--two-col'] : ''}`}>
          {sorted.map(b => (
            <li key={b.id} className={styles['month-editor__item']}>
              <span>{b.name} — {b.day}</span>
              <button
                className={styles['month-editor__remove-btn']}
                type="button"
                onClick={() => handleRemove(b.id)}
                aria-label={`Remove ${b.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
