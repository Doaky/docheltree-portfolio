import type { CalendarState, MonthData, MonthWeather, WeatherLabel, CalendarEvent } from './types';
import { DEFAULT_HOLIDAYS, MONTH_NAMES, CAT_PART_COUNT } from './constants';

export function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function buildFreshState(): CalendarState {
  const months: MonthData[] = MONTH_NAMES.map((_, monthIndex) => {
    const holidays: CalendarEvent[] = (DEFAULT_HOLIDAYS[monthIndex] ?? []).map(({ day, label }) => ({
      id: makeId(),
      day,
      label,
      isHoliday: true,
      enabled: true,
    }));
    return {
      monthIndex,
      weather: { avgHighF: null, avgLowF: null, label: null },
      // Each month starts with a unique variant index so all 12 cats differ by default
      cat: {
        brows: (monthIndex % CAT_PART_COUNT) + 1,
        eyes: (monthIndex % CAT_PART_COUNT) + 1,
        nose: (monthIndex % CAT_PART_COUNT) + 1,
        whiskers: (monthIndex % CAT_PART_COUNT) + 1,
      },
      birthdays: [],
      events: holidays,
    };
  });

  return {
    setup: { zipCode: '', tempUnit: 'F', lat: null, lon: null },
    months,
  };
}

export function encodeCalendarState(state: CalendarState): string {
  return btoa(encodeURIComponent(JSON.stringify(state)));
}

export function decodeCalendarState(encoded: string): CalendarState | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(encoded)));
    if (!parsed.setup || !Array.isArray(parsed.months) || parsed.months.length !== 12) return null;
    return parsed as CalendarState;
  } catch {
    return null;
  }
}

export function formatTemp(f: number | null, unit: 'F' | 'C'): string {
  if (f === null) return '—';
  if (unit === 'F') return `${Math.round(f)}°F`;
  const c = (f - 32) * 5 / 9;
  return `${Math.round(c)}°C`;
}

function deriveWeatherLabel(avgLowF: number, avgHighF: number, totalPrecipMm: number): WeatherLabel {
  if (avgLowF < 32 && totalPrecipMm > 30) return 'snowy';
  if (totalPrecipMm > 80) return 'rainy';
  if (totalPrecipMm > 40) return 'cloudy';
  if (totalPrecipMm < 20 && avgHighF > 65) return 'sunny';
  return 'mixed';
}

export async function fetchWeather(
  zip: string
): Promise<{ lat: number; lon: number; months: MonthWeather[] }> {
  // Phase 1: zip → lat/lon via Nominatim (OpenStreetMap, free, no key)
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zip)}&country=us&format=json`,
    { headers: { 'Accept-Language': 'en-US,en' } }
  );
  if (!geoRes.ok) throw new Error('Geocoding request failed');
  const geoData: Array<{ lat: string; lon: string }> = await geoRes.json();
  if (!Array.isArray(geoData) || geoData.length === 0) throw new Error('ZIP code not found');

  const lat = parseFloat(geoData[0].lat);
  const lon = parseFloat(geoData[0].lon);

  // Phase 2: fetch previous year's daily data from Open-Meteo Archive (free, no key)
  const prevYear = new Date().getFullYear() - 1;
  const archiveUrl = new URL('https://archive-api.open-meteo.com/v1/archive');
  archiveUrl.searchParams.set('latitude', lat.toString());
  archiveUrl.searchParams.set('longitude', lon.toString());
  archiveUrl.searchParams.set('start_date', `${prevYear}-01-01`);
  archiveUrl.searchParams.set('end_date', `${prevYear}-12-31`);
  archiveUrl.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum');
  archiveUrl.searchParams.set('temperature_unit', 'fahrenheit');
  archiveUrl.searchParams.set('timezone', 'auto');

  const archiveRes = await fetch(archiveUrl.toString());
  if (!archiveRes.ok) throw new Error('Weather archive request failed');
  const archiveData = await archiveRes.json();

  if (!archiveData.daily?.time) throw new Error('Weather data unavailable for this location');

  const {
    time,
    temperature_2m_max: maxTemps,
    temperature_2m_min: minTemps,
    precipitation_sum: precips,
  }: {
    time: string[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_sum: (number | null)[];
  } = archiveData.daily;

  // Group daily records by month (0-indexed)
  const byMonth: { highs: number[]; lows: number[]; precip: number[] }[] =
    Array.from({ length: 12 }, () => ({ highs: [], lows: [], precip: [] }));

  for (let i = 0; i < time.length; i++) {
    const monthIdx = parseInt(time[i].slice(5, 7), 10) - 1;
    if (maxTemps[i] != null) byMonth[monthIdx].highs.push(maxTemps[i]!);
    if (minTemps[i] != null) byMonth[monthIdx].lows.push(minTemps[i]!);
    if (precips[i] != null) byMonth[monthIdx].precip.push(precips[i]!);
  }

  const months: MonthWeather[] = byMonth.map(({ highs, lows, precip }) => {
    if (highs.length === 0 || lows.length === 0) {
      return { avgHighF: null, avgLowF: null, label: null };
    }
    const avgHighF = Math.round(highs.reduce((a, b) => a + b, 0) / highs.length);
    const avgLowF = Math.round(lows.reduce((a, b) => a + b, 0) / lows.length);
    const totalPrecip = precip.reduce((a, b) => a + b, 0);
    const label = deriveWeatherLabel(avgLowF, avgHighF, totalPrecip);
    return { avgHighF, avgLowF, label };
  });

  return { lat, lon, months };
}
