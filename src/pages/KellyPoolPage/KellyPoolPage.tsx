import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './KellyPoolPage.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import SEO from '../../components/SEO/SEO';
import { useFavicon } from '../../hooks/useFavicon';

const TOTAL_MS = 400; // fixed duration for the reassign shake

// ─── Shuffle flavour text ─────────────────────────────────────────────────────

const SHUFFLE_WORDS = [
  'Racking', 'Shuffling', 'Jumbling', 'No peeking',
  'Shaking it up', 'Asking RNGesus', 'Rigging it',
  // 'Rolling a D{n}' is added dynamically with the player count
];

const SHUFFLE_ANIMS: string[][] = [
  ['⁘', '⁙', '⁘', '⁙'],
  ['[=···]', '[·=··]', '[··=·]', '[···=]', '[··=·]', '[·=··]'],
  ['█▓░', '▓█▓', '░▓█', '▓░▓'],
  ['▃▅▇', '▅▇▅', '▇▅▃', '▅▃▅'],
  ['—', '\\', '|', '/', '—', '\\', '|', '/'],
  ['⠋', '⠙', '⠸', '⠴', '⠦', '⠇'],
  ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'],
  ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'],
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Player {
  id: number;
  ball: number;
  revealed: boolean;
}

// ─── Ball colours ─────────────────────────────────────────────────────────────

const BALL_COLORS: Record<number, string> = {
  1: '#f5c518', 2: '#1d4ed8', 3: '#dc2626', 4: '#7c3aed',
  5: '#ea580c', 6: '#16a34a', 7: '#92400e', 8: '#111827',
};

function getBallColor(ball: number) {
  return BALL_COLORS[ball > 8 ? ball - 8 : ball];
}

// ─── Pool ball ────────────────────────────────────────────────────────────────

function PoolBall({ ball, size = 72 }: { ball: number; size?: number }) {
  const color = getBallColor(ball);
  const stripe = ball > 8;

  return (
    <div
      className={styles['kelly-pool__pool-ball']}
      style={{ width: size, height: size, backgroundColor: stripe ? '#fff' : color }}
      aria-hidden="true"
    >
      {stripe && <div className={styles['kelly-pool__stripe']} style={{ backgroundColor: color }} />}
      <div className={styles['kelly-pool__ball-sheen']} />
      <span className={styles['kelly-pool__ball-number']}>
        {ball}
      </span>
    </div>
  );
}

function QuestionBall({ size = 72 }: { size?: number }) {
  const numSize = Math.round(size * 0.38);
  return (
    <div
      className={styles['kelly-pool__question-ball']}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className={styles['kelly-pool__ball-sheen']} />
      <span
        className={styles['kelly-pool__question-inner']}
        style={{ fontSize: numSize, width: size * 0.54, height: size * 0.54 }}
      >
        ?
      </span>
    </div>
  );
}

// ─── Game logic ───────────────────────────────────────────────────────────────

function dealBalls(count: number): Player[] {
  const pool = Array.from({ length: 15 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1, ball: pool[i], revealed: false,
  }));
}

// ─── Setup screen ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'kellypool-player-count';

function getSavedCount(): number {
  const v = parseInt(localStorage.getItem(STORAGE_KEY) ?? '', 10);
  return v >= 1 && v <= 15 ? v : 4;
}

function SetupScreen({ onStart, onExitStart }: { onStart: (count: number) => void; onExitStart: () => void }) {
  const [count, setCount] = useState(getSavedCount);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [exiting, setExiting] = useState(false);

  function increment() {
    setDirection('up');
    setCount(c => c + 1);
  }

  function decrement() {
    setDirection('down');
    setCount(c => c - 1);
  }

  function handleDeal() {
    setExiting(true);
    onExitStart();
    setTimeout(() => onStart(count), 300);
  }

  return (
    <div className={`${styles['kelly-pool__screen']} ${exiting ? styles['kelly-pool__screen--exit'] : ''}`}>
      <h1 className={styles['kelly-pool__title']}>Kelly Pool Generator</h1>
      <p className={styles['kelly-pool__subtitle']}>How many players?</p>

      <div className={styles['kelly-pool__stepper']}>
        <button className={styles['kelly-pool__step-btn']} onClick={decrement} disabled={count <= 1}>−</button>
        <div className={styles['kelly-pool__step-value-wrapper']}>
          <span
            key={count}
            className={[
              styles['kelly-pool__step-value'],
              direction === 'up' ? styles['kelly-pool__step-value--up'] : '',
              direction === 'down' ? styles['kelly-pool__step-value--down'] : '',
            ].join(' ')}
          >
            {count}
          </span>
        </div>
        <button className={styles['kelly-pool__step-btn']} onClick={increment} disabled={count >= 15}>+</button>
      </div>

      <button className={styles['kelly-pool__primary-btn']} onClick={handleDeal} disabled={exiting}>Deal balls ➔</button>
    </div>
  );
}

// ─── Game screen ──────────────────────────────────────────────────────────────

function GameScreen({ players, onToggle, onRedeal, onNewGame, reassigning, fadeIn, onRevealAll, onHideAll, shuffleDisplay }: {
  players: Player[];
  onToggle: (id: number) => void;
  onRedeal: () => void;
  onNewGame: () => void;
  onRevealAll: () => void;
  onHideAll: () => void;
  reassigning: boolean;
  fadeIn: boolean;
  shuffleDisplay: { word: string; frame: string };
}) {
  const [confirmReveal, setConfirmReveal] = useState(false);
  const revealedCount = players.filter(p => p.revealed).length;
  const showHideAll = revealedCount > 1;

  function handleRevealAll() {
    if (confirmReveal) {
      setConfirmReveal(false);
      onRevealAll();
    } else {
      setConfirmReveal(true);
    }
  }

  // Reset confirm state if reassigning starts or hide-all kicks in
  useEffect(() => {
    if (reassigning || showHideAll) setConfirmReveal(false);
  }, [reassigning, showHideAll]);

  return (
    <div className={styles['kelly-pool__game-screen']}>
      <div className={styles['kelly-pool__player-list']}>
        {players.map((p, i) => (
          <div
            key={p.id}
            className={[
              styles['kelly-pool__player-row'],
              reassigning ? (i % 2 === 0 ? styles['kelly-pool__player-row--shuffling'] : styles['kelly-pool__player-row--shuffling-alt']) : '',
              (!reassigning && fadeIn) ? styles['kelly-pool__player-row--fade-in'] : '',
            ].join(' ')}
            style={reassigning
              ? { animationDuration: `${TOTAL_MS}ms` }
              : fadeIn ? { animationDelay: `${i * 50}ms` } : undefined
            }
            onClick={() => { if (!reassigning) onToggle(p.id); }}
            aria-label={
              p.revealed
                ? `Player ${p.id}: ball ${p.ball}. Tap to hide.`
                : `Player ${p.id}: tap to reveal your ball`
            }
            aria-disabled={reassigning}
            role="button"
            tabIndex={reassigning ? -1 : 0}
            onKeyDown={e => { if (!reassigning && (e.key === 'Enter' || e.key === ' ')) onToggle(p.id); }}
          >
            <span className={styles['kelly-pool__player-label']} aria-hidden="true">Player {p.id}</span>
            <div className={`${styles['kelly-pool__flip-card']} ${p.revealed ? styles['kelly-pool__flip-card--flipped'] : ''}`} aria-hidden="true">
              <div className={styles['kelly-pool__flip-inner']}>
                <div className={styles['kelly-pool__flip-front']}><QuestionBall size={40} /></div>
                <div className={styles['kelly-pool__flip-back']}><PoolBall ball={p.ball} size={40} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles['kelly-pool__game-actions']}>
        {showHideAll ? (
          <button
            className={`${styles['kelly-pool__ghost-btn']} ${styles['kelly-pool__ghost-btn--hide-all']}`}
            onClick={onHideAll}
            disabled={reassigning}
          >
            Hide all
          </button>
        ) : (
          <button
            className={`${styles['kelly-pool__ghost-btn']} ${confirmReveal ? styles['kelly-pool__ghost-btn--confirm'] : ''}`}
            onClick={handleRevealAll}
            disabled={reassigning}
          >
            {confirmReveal ? 'Tap again to confirm' : 'Reveal all'}
          </button>
        )}
        <div className={styles['kelly-pool__game-actions-row']}>
          <button
            className={`${styles['kelly-pool__secondary-btn']} ${reassigning ? styles['kelly-pool__secondary-btn--active'] : ''}`}
            onClick={onRedeal}
            disabled={reassigning}
          >
            {reassigning ? `${shuffleDisplay.word} ${shuffleDisplay.frame}` : 'Reassign balls'}
          </button>
          <button className={styles['kelly-pool__primary-btn']} onClick={onNewGame} disabled={reassigning}>New game</button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KellyPoolPage() {
  useFavicon('/favicon.svg');
  const [players, setPlayers] = useState<Player[]>([]);
  const [reassigning, setReassigning] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [shuffleDisplay, setShuffleDisplay] = useState({ word: '', frame: '' });
  const [setupExiting, setSetupExiting] = useState(false);

  function start(count: number) {
    localStorage.setItem(STORAGE_KEY, String(count));
    setSetupExiting(false);
    setFadeIn(true);
    setPlayers(dealBalls(count));
  }

  function toggle(id: number) {
    setPlayers(ps => {
      const anyRevealed = ps.some(p => p.revealed);
      const tapped = ps.find(p => p.id === id);
      if (tapped?.revealed) {
        // Hide the tapped ball
        return ps.map(p => p.id === id ? { ...p, revealed: false } : p);
      } else if (anyRevealed) {
        // Another ball is showing — hide it, don't reveal tapped
        return ps.map(p => ({ ...p, revealed: false }));
      } else {
        // Nothing revealed — reveal tapped
        return ps.map(p => ({ ...p, revealed: p.id === id }));
      }
    });
  }

  function redeal() {
    if (reassigning) return;
    const count = players.length;

    const words = [...SHUFFLE_WORDS, `Rolling a D${count}`];
    const word = pickRandom(words);
    const anim = pickRandom(SHUFFLE_ANIMS);
    const frameMs = Math.floor(TOTAL_MS / anim.length);

    let frame = 0;
    setShuffleDisplay({ word, frame: anim[0] });
    const interval = setInterval(() => {
      frame = (frame + 1) % anim.length;
      setShuffleDisplay({ word, frame: anim[frame] });
    }, frameMs);

    setReassigning(true);
    setFadeIn(false);
    setPlayers(ps => ps.map(p => ({ ...p, revealed: false })));
    setTimeout(() => {
      clearInterval(interval);
      setPlayers(dealBalls(count));
      setReassigning(false);
    }, TOTAL_MS);
  }

  function revealAll() {
    setPlayers(ps => ps.map(p => ({ ...p, revealed: true })));
  }

  function hideAll() {
    setPlayers(ps => ps.map(p => ({ ...p, revealed: false })));
  }

  function newGame() {
    setPlayers([]);
  }

  return (
    <div className={styles['kelly-pool']}>
      <SEO title="Kelly Pool Generator" description="Free Kelly pool pea generator. Randomly assign numbered pills to 2–15 players — no shake bottle needed. Play pea pool anywhere, instantly." />
      {players.length === 0 && (
        <div className={`${styles['kelly-pool__gradient-bg']} ${setupExiting ? styles['kelly-pool__gradient-bg--exit'] : ''}`} />
      )}
      <NavBar
        title="Kelly Pool Generator"
        className={styles['kelly-pool__nav']}
        rightContent={
          <Link to="/projects/kellypool-legacy" className={styles['kelly-pool__legacy-link']}>Legacy version →</Link>
        }
      />

      {players.length === 0
        ? <SetupScreen onStart={start} onExitStart={() => setSetupExiting(true)} />
        : <GameScreen
            players={players}
            onToggle={toggle}
            onRedeal={redeal}
            onNewGame={newGame}
            onRevealAll={revealAll}
            onHideAll={hideAll}
            reassigning={reassigning}
            fadeIn={fadeIn}
            shuffleDisplay={shuffleDisplay}
          />
      }
      <Footer projectSlug="kellypool" className={styles['kelly-pool__footer']} />
    </div>
  );
}
