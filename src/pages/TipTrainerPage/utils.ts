import type { Receipt } from './types';

// ─── Seeded PRNG (mulberry32) ───────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function deriveReceiptSeed(sessionSeed: number, index: number): number {
  return ((sessionSeed * 1664525 + index * 22695477 + 1013904223) >>> 0);
}

// ─── Receipt Generation ─────────────────────────────────────────────────────

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomChars(rng: () => number, len: number): string {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += CHARS[Math.floor(rng() * CHARS.length)];
  }
  return out;
}

export function buildReceipt(sessionSeed: number, index: number, maxCents = 15000): Receipt {
  const seed = deriveReceiptSeed(sessionSeed, index);
  const rng = mulberry32(seed);

  const clampedMax = Math.max(maxCents, 500);
  const subtotal = Math.round(rng() * (clampedMax - 500) + 500);
  const cardReader = rng() < 0.5 ? 'Swiped' : ('Chip' as 'Swiped' | 'Chip');

  // Approval code: 6–8 chars
  const approvalLen = 6 + Math.floor(rng() * 3); // 6, 7, or 8
  const approvalCode = randomChars(rng, approvalLen);

  // Payment ID
  const paymentId = 'TXN-' + randomChars(rng, 8);

  const tax = Math.round(subtotal * 0.1);
  const tip = Math.round(subtotal * 0.2);
  const total = subtotal + tax + tip;

  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');

  return {
    index,
    subtotal,
    tax,
    tip,
    total,
    approvalCode,
    paymentId,
    cardReader,
    dateDisplay: `${mm}/${dd}/${yyyy}`,
    timeDisplay: `${hh}:${min}`,
  };
}

export function generateReceipts(sessionSeed: number, count: number, startIndex = 0, maxCents = 15000): Receipt[] {
  return Array.from({ length: count }, (_, i) => buildReceipt(sessionSeed, startIndex + i, maxCents));
}

export function newSessionSeed(): number {
  return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
}

// ─── Formatting ─────────────────────────────────────────────────────────────

export function formatMoney(cents: number): string {
  const dollars = Math.floor(Math.abs(cents) / 100);
  const pennies = Math.abs(cents) % 100;
  return `$${dollars}.${String(pennies).padStart(2, '0')}`;
}

export function formatTime(ms: number): string {
  const totalTenths = Math.floor(ms / 100);
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

// ─── Input Parsing ──────────────────────────────────────────────────────────

export function parseDollars(raw: string): number | null {
  const cleaned = raw.replace(/^\$/, '').trim();
  if (cleaned === '' || cleaned === '.') return null;
  if (!/^\d*\.?\d{0,2}$/.test(cleaned)) return null;
  const f = parseFloat(cleaned);
  if (isNaN(f) || f < 0) return null;
  return Math.round(f * 100);
}

// ─── localStorage ───────────────────────────────────────────────────────────

const CHECK_KEY = 'tip-trainer-check-number';

export function loadCheckNumber(): number {
  try {
    const v = parseInt(localStorage.getItem(CHECK_KEY) ?? '', 10);
    return isNaN(v) || v < 0 ? 0 : v;
  } catch {
    return 0;
  }
}

export function saveCheckNumber(n: number): void {
  try {
    localStorage.setItem(CHECK_KEY, String(n));
  } catch { /* ignore quota errors */ }
}

// ─── Share / Comparison ─────────────────────────────────────────────────────

export function buildShareText(ms: number, seed: number): string {
  const time = formatTime(ms);
  const url = `${window.location.origin}/projects/tip-trainer?seed=${seed}&ref=${Math.round(ms)}`;
  return `⏳ ${time} ${url}`;
}

export function getComparisonMessage(myMs: number, refMs: number): string {
  const ratio = myMs / refMs;
  if (ratio < 0.7) return 'Time to brag';
  if (ratio < 0.9) return 'You beat them!';
  if (ratio < 1.1) return 'A photo finish';
  if (ratio < 1.4) return 'Close, but not quite';
  return 'Maybe pretend you didn\'t play';
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}
