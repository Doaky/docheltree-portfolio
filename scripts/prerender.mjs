// Post-build prerender script.
// Runs automatically via "postbuild" in package.json after `vite build`.
//
// Purpose: Social crawlers (iMessage, Discord, Slack, Twitter/X) don't execute
// JavaScript. They fetch raw HTML and parse <head>. This script bakes per-route
// meta tags into static HTML files so crawlers get the right title, description,
// and OG image for each page.
//
// Side effect: also fixes gh-pages direct-link 404s, because gh-pages needs a
// physical index.html at each route path.
//
// To add a new route: add an entry to the `routes` array below and rebuild.
// Do NOT add redirect routes (/kellypool, /projects/kellypool-claude).

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const SITE_NAME = 'Daniel Ocheltree';
const BASE_URL = 'https://danielocheltree.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

const routes = [
  {
    path: '/',
    title: SITE_NAME,
    description: 'Software Engineer and tinkerer. I build things for the web and for fun.',
  },
  {
    path: '/projects',
    title: `Projects // ${SITE_NAME}`,
    description: 'All projects by Daniel Ocheltree — web apps, documentation, and crafts.',
  },
  // App pages (bare titles — no site name)
  {
    path: '/projects/kellypool',
    title: 'Kelly Pool Generator',
    description: 'Free Kelly pool pea generator. Randomly assign numbered pills to 2–15 players — no shake bottle needed. Play pea pool anywhere, instantly.',
  },
  {
    path: '/projects/kellypool-legacy',
    title: 'Kelly Pool (Legacy)',
    description: 'Legacy Kelly Pool generator.',
  },
  {
    path: '/projects/tip-trainer',
    title: 'Tip Trainer',
    description: 'Train your tip math with randomized restaurant receipts. Practice on your own or race friends in a timed speed round - sharpen your 20% mental math faster than your friends.',
  },
  // Project detail pages
  {
    path: '/projects/web-apps/kelly-pool',
    title: 'Kelly Pool Generator',
    description: 'About the Kelly Pool Generator project — a free web app to randomly assign numbered pills to 2–15 players without a shake bottle.',
  },
  {
    path: '/projects/web-apps/tip-trainer',
    title: 'Tip Trainer',
    description: 'About the Tip Trainer project — a web app to practice 20% tip math with randomized restaurant receipts and timed speed rounds.',
  },
  {
    path: '/projects/documentation/hyperion',
    title: `Hyperion // ${SITE_NAME}`,
    description: 'A Raspberry Pi project.',
  },
];

const dist = new URL('../dist', import.meta.url).pathname;
const template = readFileSync(join(dist, 'index.html'), 'utf8');

for (const route of routes) {
  const canonical = `${BASE_URL}${route.path}`;
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${route.description}" />`
    )
    .replace(
      '</head>',
      [
        `    <link rel="canonical" href="${canonical}" />`,
        `    <meta property="og:type" content="website" />`,
        `    <meta property="og:site_name" content="${SITE_NAME}" />`,
        `    <meta property="og:title" content="${route.title}" />`,
        `    <meta property="og:description" content="${route.description}" />`,
        `    <meta property="og:url" content="${canonical}" />`,
        `    <meta property="og:image" content="${DEFAULT_IMAGE}" />`,
        `    <meta property="og:image:width" content="1200" />`,
        `    <meta property="og:image:height" content="630" />`,
        `    <meta name="twitter:card" content="summary_large_image" />`,
        `    <meta name="twitter:title" content="${route.title}" />`,
        `    <meta name="twitter:description" content="${route.description}" />`,
        `    <meta name="twitter:image" content="${DEFAULT_IMAGE}" />`,
        `    <meta name="twitter:image:alt" content="${route.title} preview" />`,
        `  </head>`,
      ].join('\n')
    );

  const outDir = join(dist, route.path === '/' ? '' : route.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf8');
  console.log(`Prerendered: ${route.path}`);
}

console.log(`\nPrerender complete — ${routes.length} routes.`);
