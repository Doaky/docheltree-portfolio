export type ProjectCategory = 'web-apps' | 'tinkering' | 'crafts' | 'film';

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  'web-apps': 'Web Apps',
  'tinkering': 'Tinkering',
  'crafts': 'Crafts',
  'film': 'Film',
};

export const CATEGORY_ORDER: ProjectCategory[] = ['web-apps', 'tinkering', 'crafts', 'film'];

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
  {
    slug: 'kelly-pool',
    title: 'Kelly Pool Generator',
    category: 'web-apps',
    shortDescription: 'Pass-your-phone Kelly Pool with flip-card reveals and CSS-rendered balls.',
    fullDescription:
      'A fresh take on the Kelly Pool ball generator. Players pass the phone around; each person taps to flip-reveal their ball. No duplicate assignments — uses a Fisher-Yates shuffle across all 15 balls.',
    tags: ['React', 'TypeScript', 'CSS'],
    date: '2025',
    appRoute: '/projects/kellypool',
  },
  {
    slug: 'kelly-pool-legacy',
    title: 'Kelly Pool (Legacy)',
    category: 'web-apps',
    shortDescription: 'Ball generator for Kelly Pool (also known as Pills or Peas).',
    fullDescription:
      'Randomly assigns pool balls (1–15) to players for a game of Kelly Pool. Each player\'s ball is hidden until revealed. Originally built as a plain HTML/JS page and ported to React.',
    tags: ['React', 'TypeScript'],
    date: '2017',
    appRoute: '/projects/kellypool-legacy',
  },
  {
    slug: 'tip-trainer',
    title: 'Tip Trainer',
    category: 'web-apps',
    shortDescription: 'Practice calculating tips.',
    fullDescription: 'A web app for practicing tip calculations.',
    date: '2023',
  },
  {
    slug: 'hyperion',
    title: 'Hyperion',
    category: 'tinkering',
    shortDescription: 'A Raspberry Pi project.',
    fullDescription: 'Details about the Hyperion project.',
    date: '2023',
  },
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
