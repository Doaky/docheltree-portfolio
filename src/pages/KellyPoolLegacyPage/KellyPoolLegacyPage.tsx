import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './KellyPoolLegacyPage.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import SEO from '../../components/SEO/SEO';
import { useFavicon } from '../../hooks/useFavicon';

// ─── CSS Pool Ball ─────────────────────────────────────────────────────────────

const BALL_COLORS: Record<number, string> = {
  1: '#f6ad2d', 2: '#1e519e', 3: '#e8383d', 4: '#69318e',
  5: '#ed6d2b', 6: '#43b153', 7: '#a74f62', 8: '#302623',
};

function getBallColor(n: number) {
  return BALL_COLORS[n > 8 ? n - 8 : n];
}

function PoolBall({ ball }: { ball: number }) {
  const color = getBallColor(ball);
  const stripe = ball > 8;
  return (
    <div
      className={styles['kelly-pool-legacy__css-ball']}
      style={{ backgroundColor: stripe ? '#fff' : color }}
      aria-hidden="true"
    >
      {stripe && (
        <div className={styles['kelly-pool-legacy__css-ball-stripe']} style={{ backgroundColor: color }} />
      )}
      <div className={styles['kelly-pool-legacy__css-ball-sheen']} />
      <span className={styles['kelly-pool-legacy__css-ball-number']}>{ball}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface Player {
  playerId: number;
  assignedBall: number;
  visible: boolean;
}

const TOTAL_PLAYERS = Array.from({ length: 15 }, (_, i) => i + 1);
const MIN_PLAYERS = 1;
const MAX_PLAYERS = 15;

function assignBalls(count: number): Player[] {
  const available = [...TOTAL_PLAYERS];
  return Array.from({ length: count }, (_, i) => {
    const rand = Math.floor(Math.random() * (15 - (i + 1)));
    const ball = available[rand];
    available.splice(rand, 1);
    return { playerId: i + 1, assignedBall: ball, visible: false };
  });
}

interface PlayerRowProps {
  player: Player;
  onToggle: (id: number) => void;
}

function PlayerRow({ player, onToggle }: PlayerRowProps) {
  return (
    <li className={styles['kelly-pool-legacy__player-row']}>
      <span className={styles['kelly-pool-legacy__player-label']}>Player {player.playerId}</span>

      {player.visible && (
        <div className={styles['kelly-pool-legacy__ball-display']}>
          <PoolBall ball={player.assignedBall} />
        </div>
      )}

      <button
        className={styles['kelly-pool-legacy__reveal-btn']}
        onClick={() => onToggle(player.playerId)}
      >
        {player.visible ? 'Hide' : 'Show'}
      </button>
    </li>
  );
}

function KellyPoolLegacyPage() {
  useFavicon('/favicon.svg');
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<Player[]>(() => assignBalls(2));
  const [shaking, setShaking] = useState(false);


  function updateCount(next: number) {
    if (next < MIN_PLAYERS || next > MAX_PLAYERS) return;
    setPlayerCount(next);
    setPlayers(assignBalls(next));
  }

  function reassignBalls() {
    setPlayers(assignBalls(playerCount));
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }

  function changeVisibility(playerId: number) {
    setPlayers(prev =>
      prev.map(p => p.playerId === playerId ? { ...p, visible: !p.visible } : p)
    );
  }

  return (
    <section className={styles['kelly-pool-legacy']}>
      <SEO title="Kelly Pool (Legacy)" description="Legacy Kelly Pool generator." />
      <NavBar
        title="Kelly Pool (Legacy)"
        className={styles['kelly-pool-legacy__nav']}
        rightContent={
          <Link to="/projects/kellypool" className={styles['kelly-pool-legacy__updated-link']}>Updated version →</Link>
        }
      />
      <div className={styles['kelly-pool-legacy__view']}>
        <h1>Kelly Pool Generator</h1>

        <div className={styles['kelly-pool-legacy__select-wrapper']}>
          <select
            className={styles['kelly-pool-legacy__player-select']}
            value={playerCount}
            onChange={e => updateCount(Number(e.target.value))}
            aria-label="Number of players"
          >
            {Array.from({ length: MAX_PLAYERS }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} players</option>
            ))}
          </select>
        </div>

        <ul className={`${styles['kelly-pool-legacy__player-list']} ${shaking ? styles['kelly-pool-legacy__player-list--shake'] : ''}`}>
          {players.map(player => (
            <PlayerRow
              key={player.playerId}
              player={player}
              onToggle={changeVisibility}
            />
          ))}
        </ul>

        {players.length > 0 && (
          <button className={styles['kelly-pool-legacy__reassign-btn']} onClick={reassignBalls}>
            Reassign Balls
          </button>
        )}
      </div>
      <Footer projectSlug="kellypool-legacy" className={styles['kelly-pool-legacy__footer']} />
    </section>
  );
}

export default KellyPoolLegacyPage;
