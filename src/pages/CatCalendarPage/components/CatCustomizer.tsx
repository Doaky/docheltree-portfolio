import { useState, useEffect, useRef } from 'react';
import type { CatSelection, CatPart } from '../types';
import { CAT_PARTS, CAT_PART_COUNT, CAT_PART_LABELS, PLACEHOLDER_COLORS, USING_PLACEHOLDERS } from '../constants';
import styles from './MonthEditor.module.scss';

const ARROW_FRAMES = ['➫', '➪', '➬', '➪'];

type HoverTarget = { part: CatPart; side: 'left' | 'right' } | null;
type SlideDir = 'left' | 'right';

interface Props {
  cat: CatSelection;
  onChange: (cat: CatSelection) => void;
}

export default function CatCustomizer({ cat, onChange }: Props) {
  const [hoverTarget, setHoverTarget] = useState<HoverTarget>(null);
  const [arrowFrame, setArrowFrame] = useState(0);
  const [slideDirs, setSlideDirs] = useState<Partial<Record<CatPart, SlideDir>>>({});

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideTimers = useRef<Partial<Record<CatPart, ReturnType<typeof setTimeout>>>>({});

  // Animate only the currently hovered arrow
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (hoverTarget === null) { setArrowFrame(0); return; }
    intervalRef.current = setInterval(() => {
      setArrowFrame(f => (f + 1) % ARROW_FRAMES.length);
    }, 300);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hoverTarget]);

  const stepPart = (part: CatPart, dir: 1 | -1) => {
    const next = ((cat[part] - 1 + dir + CAT_PART_COUNT) % CAT_PART_COUNT) + 1;
    onChange({ ...cat, [part]: next });

    // Trigger slide animation: next (dir=1) slides in from right; prev (dir=-1) from left
    const slideDir: SlideDir = dir === 1 ? 'right' : 'left';
    setSlideDirs(prev => ({ ...prev, [part]: slideDir }));
    clearTimeout(slideTimers.current[part]);
    slideTimers.current[part] = setTimeout(() => {
      setSlideDirs(prev => { const n = { ...prev }; delete n[part]; return n; });
    }, 220);
  };

  const animChar = ARROW_FRAMES[arrowFrame];

  const isHovered = (part: CatPart, side: 'left' | 'right') =>
    hoverTarget?.part === part && hoverTarget?.side === side;

  return (
    <div className={styles['month-editor__cat-customizer']}>

      {/* Left: preview */}
      <div className={styles['month-editor__cat-preview-area']}>
        {USING_PLACEHOLDERS ? (
          <div className={styles['month-editor__cat-placeholder-preview']}>
            {CAT_PARTS.map(part => (
              <div
                key={part}
                className={styles['month-editor__cat-placeholder-layer']}
                style={{ background: PLACEHOLDER_COLORS[part] }}
              >
                <span>{CAT_PART_LABELS[part]} {cat[part]}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles['month-editor__cat-image-preview']}>
            {CAT_PARTS.map(part => (
              <img
                key={part}
                className={styles['month-editor__cat-layer']}
                src={`/cats/${part}/${part}-${cat[part]}.png`}
                alt={`${CAT_PART_LABELS[part]} variant ${cat[part]}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: carousels */}
      <div className={styles['month-editor__cat-carousels']}>
        {CAT_PARTS.map(part => {
          const slideDir = slideDirs[part];
          const itemClass = [
            styles['month-editor__carousel-item'],
            slideDir === 'right' ? styles['month-editor__slide--right'] : '',
            slideDir === 'left' ? styles['month-editor__slide--left'] : '',
          ].filter(Boolean).join(' ');

          return (
            <div key={part} className={styles['month-editor__carousel-row']}>
              {/* Left arrow */}
              <button
                className={styles['month-editor__arrow-btn']}
                type="button"
                onClick={() => stepPart(part, -1)}
                onMouseEnter={() => setHoverTarget({ part, side: 'left' })}
                onMouseLeave={() => setHoverTarget(null)}
                aria-label={`Previous ${CAT_PART_LABELS[part]}`}
              >
                {isHovered(part, 'left')
                  ? <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>{animChar}</span>
                  : <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>➪</span>
                }
              </button>

              {/* Carousel content — animated when value changes */}
              <div className={itemClass} key={`${part}-${cat[part]}`}>
                {USING_PLACEHOLDERS ? (
                  <div
                    className={styles['month-editor__part-placeholder']}
                    style={{ background: PLACEHOLDER_COLORS[part] }}
                  >
                    {CAT_PART_LABELS[part]} {cat[part]}
                  </div>
                ) : (
                  <img
                    className={styles['month-editor__part-thumb']}
                    src={`/cats/${part}/${part}-${cat[part]}.png`}
                    alt={`${CAT_PART_LABELS[part]} ${cat[part]}`}
                  />
                )}
              </div>

              {/* Right arrow */}
              <button
                className={styles['month-editor__arrow-btn']}
                type="button"
                onClick={() => stepPart(part, 1)}
                onMouseEnter={() => setHoverTarget({ part, side: 'right' })}
                onMouseLeave={() => setHoverTarget(null)}
                aria-label={`Next ${CAT_PART_LABELS[part]}`}
              >
                {isHovered(part, 'right') ? animChar : '➪'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
