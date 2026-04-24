export type ProjectCategory = 'web-apps' | 'documentation' | 'crafts';

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  'web-apps': 'Web Apps',
  'documentation': 'Documentation',
  'crafts': 'Crafts',
};

export const CATEGORY_ORDER: ProjectCategory[] = ['web-apps', /* 'documentation', */ 'crafts'];

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  fullDescription: string;
  image?: string;
  links?: { label: string; url: string }[];
  tags?: string[];
  date?: string;
  appRoute?: string; // route to a live interactive page within the portfolio
}

export const PROJECTS: Project[] = [
  /* WIP — cat calendar not ready for release
  {
    slug: 'cat-calendar',
    title: 'Cat Calendar Creator',
    category: 'web-apps',
    shortDescription: 'Build a printable 12-month cat calendar with custom artwork, birthdays, events, and local weather.',
    fullDescription:
      'A month-by-month calendar builder. Each month gets its own cat face assembled from four customizable parts — brows, eyes, nose, and whiskers — chosen from a carousel of hand-drawn options. Add birthdays and events, pull in average high/low temps for your zip code, then print it as a two-page layout sized for a custom 3D-printed holder.',
    tags: ['React', 'TypeScript', 'CSS', 'Open-Meteo'],
    date: '2026',
    appRoute: '/projects/cat-calendar',
  },
  */
  {
    slug: 'kelly-pool',
    title: 'Kelly Pool Generator',
    category: 'web-apps',
    shortDescription: 'Free Kelly pool pea generator. Randomly assign numbered pills to 2–15 players — no shake bottle needed. Play pea pool anywhere, instantly.',
    fullDescription:
      'A fresh take on the Kelly Pool ball generator. Players pass the phone around; each person taps to flip-reveal their ball. No duplicate assignments — uses a Fisher-Yates shuffle across all 15 balls.',
    tags: ['React', 'TypeScript', 'CSS'],
    date: '2025',
    appRoute: '/projects/kellypool',
  },
  {
    slug: 'tip-trainer',
    title: 'Tip Trainer',
    category: 'web-apps',
    shortDescription: 'Train your tip math with randomized restaurant receipts. Practice on your own or race friends in a timed speed round.',
    fullDescription: 'Train your tip math with randomized restaurant receipts. Practice on your own or race friends in a timed speed round - sharpen your 20% mental math faster than your friends.',
    tags: ['React', 'TypeScript', 'CSS'],
    date: '2026',
    appRoute: '/projects/tip-trainer',
  },
  /* WIP — documentation section not ready for release
  {
    slug: 'hyperion',
    title: 'Hyperion',
    category: 'documentation',
    shortDescription: 'A Raspberry Pi project.',
    fullDescription: 'Details about the Hyperion project.',
    date: '2023',
  },
  */
];

export function isProjectCategory(value: string): value is ProjectCategory {
  return CATEGORY_ORDER.includes(value as ProjectCategory);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return PROJECTS.filter(p => p.category === category);
}

export function getProjectBySlug(category: ProjectCategory, slug: string): Project | undefined {
  return PROJECTS.find(p => p.category === category && p.slug === slug);
}
