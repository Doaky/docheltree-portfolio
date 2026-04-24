/**
 * Generates site favicons from public/Screenshot 2026-04-23 231954.png
 *
 * Steps:
 *  1. Read the source PNG
 *  2. Remove the dark-green background (#0d1f16) → transparent
 *  3. Invert remaining pixels so the dark sketch lines become white
 *  4. Render at all required favicon sizes
 *
 * Run with: node scripts/gen-favicons.mjs
 */

import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src  = resolve(root, 'public', 'Screenshot 2026-04-23 231954.png');

// Background colour to remove: #0d1f16  → rgb(13, 31, 22)
const BG = { r: 13, g: 31, b: 22 };
const TOLERANCE = 40; // how far a pixel can deviate and still be considered background

function isBackground(r, g, b) {
  return (
    Math.abs(r - BG.r) < TOLERANCE &&
    Math.abs(g - BG.g) < TOLERANCE &&
    Math.abs(b - BG.b) < TOLERANCE
  );
}

async function buildMasterPng() {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info; // channels === 4 (RGBA)
  const buf = Buffer.from(data);

  for (let i = 0; i < buf.length; i += channels) {
    const r = buf[i], g = buf[i + 1], b = buf[i + 2];
    if (isBackground(r, g, b)) {
      // Make transparent
      buf[i] = 0; buf[i + 1] = 0; buf[i + 2] = 0; buf[i + 3] = 0;
    } else {
      // Invert — dark sketch lines become light/white
      buf[i]     = 255 - r;
      buf[i + 1] = 255 - g;
      buf[i + 2] = 255 - b;
      // keep alpha opaque
    }
  }

  return sharp(buf, { raw: { width, height, channels } }).png().toBuffer();
}

const sizes = [
  { name: 'favicon-16x16.png',   size: 16  },
  { name: 'favicon-32x32.png',   size: 32  },
  { name: 'favicon-48x48.png',   size: 48  },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'logo192.png',          size: 192 },
  { name: 'logo512.png',          size: 512 },
];

console.log('Building master PNG (removing background, inverting)…');
const master = await buildMasterPng();

for (const { name, size } of sizes) {
  const out = resolve(root, 'public', name);
  await sharp(master)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  console.log(`✓ ${name} (${size}×${size})`);
}

// Also write a master glasses.png for reference / og-image use
writeFileSync(resolve(root, 'public', 'glasses.png'), master);
console.log('✓ glasses.png (master, full-size)');

console.log('\nDone.');
