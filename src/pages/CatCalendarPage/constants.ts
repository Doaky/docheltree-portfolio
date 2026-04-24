import type { CatPart } from './types';

export const STORAGE_KEY = 'cat-calendar-v1';

// Set to false once real PNG assets are placed in /public/cats/{part}/{part}-{n}.png
export const USING_PLACEHOLDERS = true;

export const CAT_PART_COUNT = 12;

export const CAT_PARTS: CatPart[] = ['brows', 'eyes', 'nose', 'whiskers'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Days per month — using 28 for February (no specific year context)
export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const PLACEHOLDER_COLORS: Record<CatPart, string> = {
  brows: '#c4a8d4',
  eyes: '#a8c4d4',
  nose: '#d4bca8',
  whiskers: '#b4d4a8',
};

export const CAT_PART_LABELS: Record<CatPart, string> = {
  brows: 'Brows',
  eyes: 'Eyes',
  nose: 'Nose',
  whiskers: 'Whiskers',
};

export const WEATHER_LABEL_TEXT: Record<string, string> = {
  sunny: 'Mostly Sunny',
  cloudy: 'Mostly Cloudy',
  rainy: 'Rainy',
  snowy: 'Snowy',
  mixed: 'Mixed',
};

// Default US holidays seeded into each month at buildFreshState() time.
// Moveable holidays use representative fixed dates — noted with * in the label.
export const DEFAULT_HOLIDAYS: Record<number, Array<{ day: number; label: string }>> = {
  0: [  // January
    { day: 1, label: "New Year's Day" },
    { day: 20, label: 'Martin Luther King Jr. Day*' },
  ],
  1: [  // February
    { day: 14, label: "Valentine's Day" },
    { day: 17, label: "Presidents' Day*" },
  ],
  2: [  // March
    { day: 17, label: "St. Patrick's Day" },
  ],
  3: [  // April
    { day: 1, label: "April Fools' Day" },
    { day: 15, label: 'Tax Day' },
    { day: 20, label: 'Easter Sunday*' },  // Easter is moveable; adjust as needed
  ],
  4: [  // May
    { day: 11, label: "Mother's Day*" },
    { day: 26, label: 'Memorial Day*' },
  ],
  5: [  // June
    { day: 15, label: "Father's Day*" },
    { day: 19, label: 'Juneteenth' },
  ],
  6: [  // July
    { day: 4, label: 'Independence Day' },
  ],
  7: [],  // August — no default holidays
  8: [  // September
    { day: 1, label: 'Labor Day*' },
  ],
  9: [  // October
    { day: 13, label: "Columbus / Indigenous Peoples' Day*" },
    { day: 31, label: 'Halloween' },
  ],
  10: [  // November
    { day: 11, label: 'Veterans Day' },
    { day: 27, label: 'Thanksgiving*' },
  ],
  11: [  // December
    { day: 24, label: 'Christmas Eve' },
    { day: 25, label: 'Christmas Day' },
    { day: 31, label: "New Year's Eve" },
  ],
};
