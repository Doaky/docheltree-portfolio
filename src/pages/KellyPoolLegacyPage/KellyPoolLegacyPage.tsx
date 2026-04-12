import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './KellyPoolLegacyPage.module.scss';

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
    <li className={styles.playerRow}>
      <span className={styles.playerLabel}>Player {player.playerId}</span>

      {player.visible && (
        <div className={styles.ballDisplay}>
          <img
            src={`/poolballs/${player.assignedBall}.svg`}
            alt={`${player.assignedBall} ball`}
          />
          <span className={styles.poolBallText}>{player.assignedBall}</span>
        </div>
      )}

      <button
        className={styles.revealBtn}
        onClick={() => onToggle(player.playerId)}
      >
        {player.visible ? 'Hide' : 'Show'}
      </button>
    </li>
  );
}

function KellyPoolLegacyPage() {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<Player[]>(() => assignBalls(2));
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Kelly Pool Generator';
    return () => { document.title = prev; };
  }, []);

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
    <section className={styles.page}>
      <div className={styles.viewContainer}>
        <div className={styles.navRow}>
          <Link to="/projects" className={styles.backLink}>← back to projects</Link>
          <Link to="/projects/kellypool" className={styles.updatedLink}>Updated version →</Link>
        </div>

        <h1>Kelly Pool Generator</h1>

        <div className={styles.stepper}>
          <button
            className={styles.stepperBtn}
            onClick={() => updateCount(playerCount - 1)}
            disabled={playerCount <= MIN_PLAYERS}
            aria-label="Decrease player count"
          >
            −
          </button>
          <span className={styles.stepperValue}>{playerCount}</span>
          <button
            className={styles.stepperBtn}
            onClick={() => updateCount(playerCount + 1)}
            disabled={playerCount >= MAX_PLAYERS}
            aria-label="Increase player count"
          >
            +
          </button>
        </div>
        <p className={styles.stepperLabel}>players</p>

        <ul className={`${styles.playerList} ${shaking ? styles.shake : ''}`}>
          {players.map(player => (
            <PlayerRow
              key={player.playerId}
              player={player}
              onToggle={changeVisibility}
            />
          ))}
        </ul>

        {players.length > 0 && (
          <button className={styles.reassignBtn} onClick={reassignBalls}>
            Reassign Balls
          </button>
        )}
      </div>
    </section>
  );
}

export default KellyPoolLegacyPage;
