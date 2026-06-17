import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import SEO from '../../components/SEO/SEO';
import styles from './WigglegramPage.module.scss';

const TITLE = 'Wigglegram Maker — Nishika & Nimslo 3D Film to GIF';
const DESCRIPTION =
  'Free browser wigglegram maker for the Nishika N8000, Nishika N9000, Nimslo and other 4-lens 3D film cameras. Auto-align the frames and export looping GIFs or MP4s — no uploads.';
const TAGLINE =
  'Turn 3D film scans into looping wigglegram GIFs & MP4s — entirely in your browser, nothing uploaded.';

const BANNER_KEY = 'wgm-banner-dismissed';

// Structured data so search engines understand this is a free web tool.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Wigglegram Maker',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web browser',
  url: 'https://danielocheltree.com/projects/wigglegram',
  description: DESCRIPTION,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Split 3D film scans into frames',
    'Auto-Order frames by parallax',
    'Auto-Align background stabilization',
    'Animated GIF and MP4 export',
  ],
  author: { '@type': 'Person', name: 'Daniel Ocheltree' },
};

export default function WigglegramPage() {
  // Banner is hidden once dismissed — and stays hidden across sessions.
  const [showBanner, setShowBanner] = useState(() => {
    try {
      return localStorage.getItem(BANNER_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const dismissBanner = () => {
    setShowBanner(false);
    try {
      localStorage.setItem(BANNER_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <main className={styles.page}>
      <SEO title={TITLE} description={DESCRIPTION} bare />
      <Helmet>
        {/* Scalable SVG icon (the app's blue dot). sizes="any" makes browsers prefer it over the site's fixed-size PNGs. */}
        <link rel="icon" type="image/svg+xml" sizes="any" href="/wigglegram-favicon.svg" />
        <meta
          name="keywords"
          content="wigglegram, wigglegram maker, wigglegram generator, wigglegram gif, Nishika N8000, Nishika N9000, Nimslo, 3D film camera, 4 lens camera, quadrascopic, wiggle gif, parallax gif, lenticular, stereo photography, 3D photo animation"
        />
        <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      </Helmet>

      {showBanner && (
        <div className={styles.banner} role="status">
          <span className={styles.banner__text}>{TAGLINE}</span>
          <button
            type="button"
            className={styles.banner__close}
            onClick={dismissBanner}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      <NavBar title="Wigglegram Maker" className={styles.nav} />

      <section className={styles.frameWrap} aria-label="Wigglegram Maker app">
        <iframe
          className={styles.frame}
          src="/wigglegram/index.html"
          title="Wigglegram Maker — Nishika 3D animator"
          loading="lazy"
        />
      </section>

      <section className={styles.about}>
        <h1 className={styles.aboutTitle}>Wigglegram Maker</h1>
        <p className={styles.tagline}>
          Turn 3D film scans into looping <strong>wigglegram</strong> GIFs &amp; MP4s — entirely in your
          browser, nothing uploaded.
        </p>
        <p className={styles.cameras}>
          Built for the <strong>Nishika N8000</strong>, <strong>Nishika N9000</strong>,{' '}
          <strong>Nimslo</strong>, and other 4-lens 3D film cameras.
        </p>

        <h2>What is a wigglegram?</h2>
        <p>
          A wigglegram is a 3D-looking animation made by rapidly cycling between photos taken from
          slightly different viewpoints. Cameras like the Nishika N8000, Nishika N9000, and Nimslo
          capture four side-by-side half-frames in a single exposure — scan the negative, split the
          frames, and wiggle between them to fake binocular depth without glasses.
        </p>
        <h2>How the maker works</h2>
        <p>
          Upload a scan and drag the dividers to split it into individual frames. <strong>Auto-Order</strong>{' '}
          recovers the left-to-right viewpoint order from parallax, and <strong>Auto-Align</strong>{' '}
          registers the frames so the background stays put while the subject pops. Tune the focal point,
          level crooked scans, set the frame rate, crop, then export a looping GIF or MP4. Everything runs
          locally with WebAssembly — your photos never leave your device.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Adjustable frame splitting (2–8 frames per scan)</li>
          <li>Pixel-based Auto-Order &amp; Auto-Align — no AI, no servers</li>
          <li>Per-frame focal alignment, micro-rotation, and ping-pong looping</li>
          <li>Animated GIF &amp; MP4 export, in-browser and free</li>
        </ul>
      </section>

      <Footer projectSlug="wigglegram" className={styles.footer} />
    </main>
  );
}
