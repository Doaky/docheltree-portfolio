export type GameMode = 'infinite' | 'speed';
export type AnimPhase = 'idle' | 'exiting' | 'entering';

export interface Receipt {
  index: number;
  subtotal: number;      // integer cents, e.g. 4783 = $47.83
  tax: number;           // Math.round(subtotal * 0.10)
  tip: number;           // Math.round(subtotal * 0.20) — the correct answer
  total: number;         // subtotal + tax + tip
  approvalCode: string;  // e.g. "A3K8F2"
  paymentId: string;     // e.g. "TXN-4B7C2E1A"
  cardReader: 'Swiped' | 'Chip';
  dateDisplay: string;   // "MM/DD/YYYY"
  timeDisplay: string;   // "HH:MM"
}

export interface SpeedState {
  phase: 'idle' | 'running' | 'done';
  sessionSeed: number;
  elapsedMs: number;      // frozen on completion
  count: number;          // 0–10 receipts completed
  referenceMs?: number;   // opponent's time from ?ref= URL param
}
