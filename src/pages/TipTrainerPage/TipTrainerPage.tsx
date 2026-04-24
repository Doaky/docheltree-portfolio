import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnimPhase, GameMode, Receipt, SpeedState } from './types';
import {
  buildReceipt,
  buildShareText,
  copyToClipboard,
  formatMoney,
  formatTime,
  generateReceipts,
  getComparisonMessage,
  loadCheckNumber,
  newSessionSeed,
  parseDollars,
  saveCheckNumber,
} from './utils';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import SEO from '../../components/SEO/SEO';
import styles from './TipTrainerPage.module.scss';

// ─── URL Init ────────────────────────────────────────────────────────────────

function readUrlParams(): { seed?: number; ref?: number } {
  const params = new URLSearchParams(window.location.search);
  const rawSeed = params.get('seed');
  const rawRef = params.get('ref');
  const seed = rawSeed !== null ? parseInt(rawSeed, 10) >>> 0 : undefined;
  const ref = rawRef !== null ? parseInt(rawRef, 10) : undefined;
  return {
    seed: seed !== undefined && !isNaN(seed) ? seed : undefined,
    ref: ref !== undefined && !isNaN(ref) ? ref : undefined,
  };
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function TipTrainerPage() {
  // ── State ──────────────────────────────────────────────────────────────────

  const urlParams = useRef(readUrlParams());
  const isChallenge = urlParams.current.seed !== undefined && urlParams.current.ref !== undefined;

  const [mode, setMode] = useState<GameMode>(isChallenge ? 'speed' : 'infinite');
  const [checkNumber, setCheckNumber] = useState<number>(loadCheckNumber);

  // Infinite mode: session seed for consistent per-receipt generation
  const infiniteSeedRef = useRef<number>(newSessionSeed());

  // Current receipt (index) and the active receipt data
  const [receiptIndex, setReceiptIndex] = useState(0);
  const [activeReceipt, setActiveReceipt] = useState<Receipt>(() =>
    buildReceipt(infiniteSeedRef.current, 0, 15000)
  );

  const [tipInput, setTipInput] = useState('');
  const [totalInput, setTotalInput] = useState('');
  const [tipHintVisible, setTipHintVisible] = useState(false);
  const [animPhase, setAnimPhase] = useState<AnimPhase>('idle');

  const [speed, setSpeed] = useState<SpeedState>(() => ({
    phase: 'idle',
    sessionSeed: urlParams.current.seed ?? 0,
    elapsedMs: 0,
    count: 0,
    referenceMs: urlParams.current.ref,
  }));

  // Speed round receipts — pre-generated when speed round starts
  const speedReceiptsRef = useRef<Receipt[]>([]);

  const [copied, setCopied] = useState(false);
  const [focusTipSignal, setFocusTipSignal] = useState(0);
  const [confirmingExit, setConfirmingExit] = useState(false);
  const [maxDollars, setMaxDollars] = useState(150);
  const [maxInput, setMaxInput] = useState('150');

  // ── Refs ───────────────────────────────────────────────────────────────────

  const tipInputRef = useRef<HTMLInputElement>(null);
  const totalInputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number>(0);
  const startMsRef = useRef<number>(0);

  // ── rAF timer ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (speed.phase !== 'running') return;

    const tick = () => {
      setSpeed(s => ({ ...s, elapsedMs: performance.now() - startMsRef.current }));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [speed.phase]);

  // ── Focus tip input — fires after render so disabled is already cleared ────

  useEffect(() => {
    if (focusTipSignal > 0 || mode === 'infinite') {
      tipInputRef.current?.focus();
    }
  }, [focusTipSignal, mode]);

  // ── Advance receipt ─────────────────────────────────────────────────────────

  const advanceReceipt = useCallback(() => {
    const newCheck = checkNumber + 1;
    setCheckNumber(newCheck);
    saveCheckNumber(newCheck);

    setAnimPhase('exiting');

    setTimeout(() => {
      setTipInput('');
      setTotalInput('');
      setTipHintVisible(false);

      if (mode === 'speed') {
        setSpeed(prev => {
          const newCount = prev.count + 1;

          if (newCount >= 10) {
            cancelAnimationFrame(rafRef.current);
            const finalMs = performance.now() - startMsRef.current;
            return { ...prev, phase: 'done', count: newCount, elapsedMs: finalMs };
          }

          const nextReceipt = speedReceiptsRef.current[newCount];
          if (nextReceipt) {
            setReceiptIndex(newCount);
            setActiveReceipt(nextReceipt);
          }
          return { ...prev, count: newCount };
        });
      } else {
        const nextIndex = receiptIndex + 1;
        setReceiptIndex(nextIndex);
        setActiveReceipt(buildReceipt(infiniteSeedRef.current, nextIndex, maxDollars * 100));
      }

      setAnimPhase('entering');

      setTimeout(() => {
        setAnimPhase('idle');
        setFocusTipSignal(n => n + 1);
      }, 220);
    }, 150);
  }, [checkNumber, maxDollars, mode, receiptIndex]);

  // ── Speed round start ───────────────────────────────────────────────────────

  const startSpeedRound = useCallback(() => {
    const seed = isChallenge ? urlParams.current.seed! : newSessionSeed();
    const receipts = generateReceipts(seed, 10, 0);
    speedReceiptsRef.current = receipts;

    setSpeed(prev => ({
      ...prev,
      phase: 'running',
      sessionSeed: seed,
      elapsedMs: 0,
      count: 0,
    }));

    setReceiptIndex(0);
    setActiveReceipt(receipts[0]);
    setTipInput('');
    setTotalInput('');
    setTipHintVisible(false);

    startMsRef.current = performance.now();

    setFocusTipSignal(n => n + 1);
  }, [isChallenge]);

  // ── Mode switch ─────────────────────────────────────────────────────────────

  const handleModeChange = useCallback((m: GameMode) => {
    // Clicking Infinite while a speed round is running → ask first
    if (speed.phase === 'running' && m === 'infinite') {
      setConfirmingExit(true);
      return;
    }

    setConfirmingExit(false);
    setMode(m);
    setTipInput('');
    setTotalInput('');
    setTipHintVisible(false);
    setAnimPhase('idle');
    cancelAnimationFrame(rafRef.current);
    setSpeed({ phase: 'idle', sessionSeed: 0, elapsedMs: 0, count: 0, referenceMs: undefined });

    if (m === 'infinite') {
      infiniteSeedRef.current = newSessionSeed();
      setReceiptIndex(0);
      setActiveReceipt(buildReceipt(infiniteSeedRef.current, 0, maxDollars * 100));
      setFocusTipSignal(n => n + 1);
    }
  }, [maxDollars, speed.phase]);

  const confirmExitSpeed = useCallback(() => {
    // Bypass handleModeChange's running-guard — user already confirmed
    setConfirmingExit(false);
    setMode('infinite');
    setTipInput('');
    setTotalInput('');
    setTipHintVisible(false);
    setAnimPhase('idle');
    cancelAnimationFrame(rafRef.current);
    setSpeed({ phase: 'idle', sessionSeed: 0, elapsedMs: 0, count: 0, referenceMs: undefined });
    infiniteSeedRef.current = newSessionSeed();
    setReceiptIndex(0);
    setActiveReceipt(buildReceipt(infiniteSeedRef.current, 0, maxDollars * 100));
    setFocusTipSignal(n => n + 1);
  }, [maxDollars]);

  const cancelExitSpeed = useCallback(() => {
    setConfirmingExit(false);
  }, []);

  // ── Input handlers ──────────────────────────────────────────────────────────

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTipInput(val);

    const parsed = parseDollars(val);

    // Show hint if they tipped 20% of the balance or total instead of the subtotal
    const balance = activeReceipt.subtotal + activeReceipt.tax;
    const tipOnBalance = parsed !== null && parsed === Math.round(balance * 0.2);
    const tipOnTotal = parsed !== null && parsed === Math.round(activeReceipt.total * 0.2);
    setTipHintVisible(tipOnBalance || tipOnTotal);

    if (parsed !== null && parsed === activeReceipt.tip) {
      setTipHintVisible(false);
      totalInputRef.current?.focus();
    }
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (animPhase !== 'idle') return;
    const val = e.target.value;
    setTotalInput(val);

    const parsed = parseDollars(val);
    if (parsed !== null && parsed === activeReceipt.total) {
      advanceReceipt();
    }
  };

  const blocked = animPhase !== 'idle';

  // ── Receipt class ───────────────────────────────────────────────────────────

  const receiptClass = [
    styles.receipt,
    animPhase === 'exiting' ? styles.receiptExiting : '',
    animPhase === 'entering' ? styles.receiptEntering : '',
  ].filter(Boolean).join(' ');

  // ── Play again ──────────────────────────────────────────────────────────────

  const playAgain = useCallback(() => {
    setSpeed({ phase: 'idle', sessionSeed: 0, elapsedMs: 0, count: 0, referenceMs: undefined });
    setTipInput('');
    setTotalInput('');
    setTipHintVisible(false);
    setAnimPhase('idle');
  }, []);

  // ── Max amount ─────────────────────────────────────────────────────────────

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxInput(val);
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 5 && n <= 500) {
      setMaxDollars(n);
      if (mode === 'infinite') {
        setActiveReceipt(buildReceipt(infiniteSeedRef.current, receiptIndex, n * 100));
      }
    }
  };

  const handleMaxBlur = () => {
    const n = parseInt(maxInput, 10);
    const clamped = isNaN(n) ? 150 : Math.min(500, Math.max(5, n));
    setMaxDollars(clamped);
    setMaxInput(String(clamped));
    if (mode === 'infinite') {
      setActiveReceipt(buildReceipt(infiniteSeedRef.current, receiptIndex, clamped * 100));
    }
  };

  // ── Share ───────────────────────────────────────────────────────────────────

  const handleShare = useCallback(async () => {
    const text = buildShareText(speed.elapsedMs, speed.sessionSeed);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [speed.elapsedMs, speed.sessionSeed]);

  // ────────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────────

  const showSpeedHud = mode === 'speed' && speed.phase === 'running';
  const showStartScreen = mode === 'speed' && speed.phase === 'idle';
  const showCompletion = mode === 'speed' && speed.phase === 'done';

  return (
    <div className={styles.page}>
      <SEO title="Tip Trainer" description="Train your tip math with randomized restaurant receipts. Practice on your own or race friends in a timed speed round - sharpen your 20% mental math faster than your friends." favicon="🧮" />

      {/* Top bar */}
      <NavBar title="Tip Trainer" className={styles.nav} />

      {/* Speed HUD */}
      {showSpeedHud && (
        <div className={styles.speedHud}>
          <div className={styles.hudTimer}>{formatTime(speed.elapsedMs)}</div>
          <div className={styles.hudCount}>{speed.count}/10</div>
        </div>
      )}

      {/* Main content */}
      <div className={styles.content}>

        {/* Mode toggle */}
        <div className={styles.modeControls}>
          <div className={styles.modeArea}>
            <div className={`${styles.modeToggle}${confirmingExit ? ` ${styles.modeToggleHidden}` : ''}`}>
              <button
                className={`${styles.modeBtn}${mode === 'infinite' ? ` ${styles.active}` : ''}`}
                onClick={() => handleModeChange('infinite')}
                tabIndex={confirmingExit ? -1 : 0}
              >
                Infinite
              </button>
              <button
                className={`${styles.modeBtn}${mode === 'speed' ? ` ${styles.active}` : ''}`}
                onClick={() => handleModeChange('speed')}
                disabled={speed.phase === 'running'}
                tabIndex={confirmingExit ? -1 : 0}
              >
                Speed Round
              </button>
            </div>
            {confirmingExit && (
              <div className={styles.exitConfirm}>
                <span className={styles.exitConfirmText}>End speed round?</span>
                <button className={styles.exitConfirmYes} onClick={confirmExitSpeed}>Yes</button>
                <button className={styles.exitConfirmNo} onClick={cancelExitSpeed}>No</button>
              </div>
            )}
          </div>
        </div>

        {/* Max amount input — infinite mode only */}
        {mode === 'infinite' && (
          <div className={styles.maxRow}>
            <label className={styles.maxLabel} htmlFor="max-amount">Max: $</label>
            <input
              id="max-amount"
              type="number"
              className={styles.maxInput}
              value={maxInput}
              onChange={handleMaxChange}
              onBlur={handleMaxBlur}
              min={5}
              max={500}
            />
          </div>
        )}

        {/* Start screen */}
        {showStartScreen && (
          <div className={styles.startScreen}>
            <div className={styles.startTitle}>Speed Round</div>
            <div className={styles.startDesc}>
              {isChallenge && speed.referenceMs !== undefined
                ? `Can you beat ${formatTime(speed.referenceMs)}?`
                : '10 receipts. How fast can you go?'}
            </div>
            <button className={styles.startBtn} onClick={startSpeedRound}>
              Start
            </button>
          </div>
        )}

        {/* Receipt */}
        {!showStartScreen && (
          <div className={styles.receiptWrap}>
            <div className={receiptClass}>

              {/* Header */}
              <div className={styles.receiptHeader}>
                <div className={styles.restaurantName}>Moonpie's Bistro</div>
                <div className={styles.restaurantSub}>Thank you for dining with us</div>
              </div>

              <hr className={styles.solidDivider} />

              {/* Meta */}
              <div className={styles.receiptMeta}>
                <span>DATE: {activeReceipt.dateDisplay}</span>
                <span>TIME: {activeReceipt.timeDisplay}</span>
              </div>
              <div className={styles.checkLine}>CHECK: #{checkNumber + 1}</div>

              <hr className={styles.divider} />

              {/* Amounts */}
              <div className={styles.row}>
                <span className={styles.rowLabel}>Subtotal</span>
                <span className={styles.rowValue}>{formatMoney(activeReceipt.subtotal)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Tax (10%)</span>
                <span className={styles.rowValue}>{formatMoney(activeReceipt.tax)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Balance</span>
                <span className={styles.rowValue}>{formatMoney(activeReceipt.subtotal + activeReceipt.tax)}</span>
              </div>

              <hr className={styles.divider} />

              {/* Transaction details */}
              <div className={styles.transactionSection}>
                <div className={styles.txnRow}>
                  <span className={styles.txnLabel}>Transaction Type</span>
                  <span className={styles.txnValue}>Authorization</span>
                </div>
                <div className={styles.txnRow}>
                  <span className={styles.txnLabel}>Approval Code</span>
                  <span className={styles.txnValue}>{activeReceipt.approvalCode}</span>
                </div>
                <div className={styles.txnRow}>
                  <span className={styles.txnLabel}>Payment ID</span>
                  <span className={styles.txnValue}>{activeReceipt.paymentId}</span>
                </div>
                <div className={styles.txnRow}>
                  <span className={styles.txnLabel}>Card Reader</span>
                  <span className={styles.txnValue}>{activeReceipt.cardReader}</span>
                </div>
              </div>

              <hr className={styles.solidDivider} />

              {/* Inputs */}
              <div className={styles.inputSection}>
                <div className={styles.inputRow}>
                  <span className={styles.inputLabel}>+ Tip (20%):</span>
                  <input
                    ref={tipInputRef}
                    type="text"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={tipInput}
                    onChange={handleTipChange}
                    onFocus={e => e.target.select()}
                    disabled={blocked}
                    autoComplete="off"
                    placeholder="0.00"
                  />
                </div>
                <div className={styles.inputRow}>
                  <span className={styles.inputLabel}>= Total:</span>
                  <input
                    ref={totalInputRef}
                    type="text"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={totalInput}
                    onChange={handleTotalChange}
                    onFocus={e => e.target.select()}
                    disabled={blocked}
                    autoComplete="off"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Tip hint — reserved space, no layout shift */}
              <div className={`${styles.tipHint}${tipHintVisible ? ` ${styles.hintVisible}` : ''}`}>
                Tip on subtotals
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Completion overlay */}
      {showCompletion && (
        <div className={styles.overlay}>
          <div className={styles.completionCard}>
            <div className={styles.completionTitle}>Speed Round Complete</div>
            <div className={styles.completionTime}>{formatTime(speed.elapsedMs)}</div>

            {speed.referenceMs !== undefined && (
              <>
                <hr className={styles.completionDivider} />
                <div className={styles.comparisonSection}>
                  <div className={styles.comparisonRow}>
                    <span>Your time</span>
                    <span className={styles.comparisonTime}>{formatTime(speed.elapsedMs)}</span>
                  </div>
                  <div className={styles.comparisonRow}>
                    <span>Their time</span>
                    <span className={styles.comparisonTime}>{formatTime(speed.referenceMs)}</span>
                  </div>
                  <div className={styles.comparisonMessage}>
                    {getComparisonMessage(speed.elapsedMs, speed.referenceMs)}
                  </div>
                </div>
              </>
            )}

            <hr className={styles.completionDivider} />

            <button className={styles.shareBtn} onClick={handleShare}>
              {copied ? 'Copied!' : 'Share Challenge'}
            </button>
            <button className={styles.playAgainBtn} onClick={playAgain}>
              Play Again
            </button>
          </div>
        </div>
      )}

      <Footer projectSlug="tip-trainer" className={styles.footer} />
    </div>
  );
}
