import sharp from 'sharp';
import { copyFileSync } from 'fs';

const src = 'src/assets/name_animation.webp';
const backup = 'src/assets/name_animation.orig.webp';
const delays = [1200, 100, 80, 60, 50, 50, 60, 80, 100, 1600, 100, 80, 60, 50, 50, 60, 80, 100, 1200];

// Back up original
copyFileSync(src, backup);
console.log('Backed up original to', backup);

const { size: sizeBefore } = (await import('fs')).statSync(src);

await sharp(src, { animated: true })
  .resize(700)
  .webp({ quality: 82, effort: 6, delay: delays })
  .toFile('src/assets/name_animation_new.webp');

const { size: sizeAfter } = (await import('fs')).statSync('src/assets/name_animation_new.webp');

// Verify metadata
const meta = await sharp('src/assets/name_animation_new.webp', { animated: true }).metadata();
console.log(`Original: ${(sizeBefore / 1024).toFixed(1)} KiB  →  New: ${(sizeAfter / 1024).toFixed(1)} KiB`);
console.log(`Dimensions: ${meta.width}×${Math.round(meta.height / meta.pages)} per frame, ${meta.pages} frames`);
console.log('Delays:', meta.delay);
