import { useState, useEffect, useRef } from 'react';
import { MONTH_NAMES } from '../constants';
import type { WizardStep } from '../types';
import styles from './WizardNav.module.scss';

const ARROW_FRAMES = ['➫', '➪', '➬', '➪'];

interface Props {
  step: WizardStep;
  onPrev: () => void;
  onNext: () => void;
  onJump: (monthIndex: number) => void;
  onSummary: () => void;
}

export default function WizardNav({ step, onPrev, onNext, onJump, onSummary }: Props) {
  if (step === 'setup' || step === 'summary') return null;

  const monthIndex = step as number;
  const isFirst = monthIndex === 0;
  const isLast = monthIndex === 11;

  const [hoveredBtn, setHoveredBtn] = useState<'prev' | 'next' | null>(null);
  const [arrowFrame, setArrowFrame] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (hoveredBtn === null) { setArrowFrame(0); return; }
    intervalRef.current = setInterval(() => {
      setArrowFrame(f => (f + 1) % ARROW_FRAMES.length);
    }, 300);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hoveredBtn]);

  const animChar = ARROW_FRAMES[arrowFrame];

  return (
    <div className={styles['wizard-nav']}>
      <nav className={styles['wizard-nav__nav']}>
        {/* Prev button */}
        <button
          className={styles['wizard-nav__btn']}
          type="button"
          onClick={onPrev}
          onMouseEnter={() => setHoveredBtn('prev')}
          onMouseLeave={() => setHoveredBtn(null)}
          aria-label={isFirst ? 'Back to setup' : `Go to ${MONTH_NAMES[monthIndex - 1]}`}
        >
          <span className={styles['wizard-nav__btn-arrow--left']}>
            {hoveredBtn === 'prev'
              ? <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>{animChar}</span>
              : '←'}
          </span>
          {isFirst ? 'Setup' : MONTH_NAMES[monthIndex - 1]}
        </button>

        {/* Center: month name + clickable dots + count */}
        <div className={styles['wizard-nav__step-indicator']}>
          <span className={styles['wizard-nav__step-label']}>{MONTH_NAMES[monthIndex]}</span>
          <div className={styles['wizard-nav__dots']} role="tablist" aria-label="Jump to month">
            {MONTH_NAMES.map((name, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === monthIndex}
                aria-label={name}
                className={`${styles['wizard-nav__dot']} ${i === monthIndex ? styles['wizard-nav__dot--active'] : ''}`}
                onClick={() => onJump(i)}
                title={name}
              />
            ))}
          </div>
          <span className={styles['wizard-nav__step-count']}>{monthIndex + 1} of 12</span>
        </div>

        {/* Next button */}
        <button
          className={`${styles['wizard-nav__btn']} ${styles['wizard-nav__btn--next']}`}
          type="button"
          onClick={onNext}
          onMouseEnter={() => setHoveredBtn('next')}
          onMouseLeave={() => setHoveredBtn(null)}
          aria-label={isLast ? 'See summary' : `Go to ${MONTH_NAMES[monthIndex + 1]}`}
        >
          {isLast ? 'See Summary' : MONTH_NAMES[monthIndex + 1]}
          <span className={styles['wizard-nav__btn-arrow--right']}>
            {hoveredBtn === 'next' ? animChar : '→'}
          </span>
        </button>
      </nav>

      {/* "See Summary" shortcut — shown on all months so you can jump without finishing */}
      {!isLast && (
        <div className={styles['wizard-nav__summary-shortcut']}>
          <button className={styles['wizard-nav__summary-shortcut-btn']} type="button" onClick={onSummary}>
            See Summary →
          </button>
        </div>
      )}
    </div>
  );
}
