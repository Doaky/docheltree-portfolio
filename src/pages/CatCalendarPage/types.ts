export type WeatherLabel = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'mixed';
export type CatPart = 'brows' | 'eyes' | 'nose' | 'whiskers';

export interface MonthWeather {
  avgHighF: number | null;
  avgLowF: number | null;
  label: WeatherLabel | null;
}

export interface CatSelection {
  brows: number;    // 1–12
  eyes: number;
  nose: number;
  whiskers: number;
}

export interface Birthday {
  id: string;
  day: number;    // 1–31
  name: string;
}

export interface CalendarEvent {
  id: string;
  day: number;
  label: string;
  isHoliday: boolean;  // true = seeded from default list, user can toggle off
  enabled: boolean;
}

export interface MonthData {
  monthIndex: number;   // 0–11
  weather: MonthWeather;
  cat: CatSelection;
  birthdays: Birthday[];
  events: CalendarEvent[];
}

export interface CalendarSetup {
  zipCode: string;
  tempUnit: 'F' | 'C';
  lat: number | null;
  lon: number | null;
}

export interface CalendarState {
  setup: CalendarSetup;
  months: MonthData[];  // always length 12
}

// 'setup' = setup screen, number = month editor (0–11), 'summary' = final summary
export type WizardStep = 'setup' | number | 'summary';
