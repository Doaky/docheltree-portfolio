import { useState, useEffect, useRef, useCallback } from 'react';
import type { CalendarState, MonthData, WizardStep } from './types';
import { buildFreshState, encodeCalendarState, decodeCalendarState, fetchWeather } from './utils';
import { STORAGE_KEY } from './constants';
import SetupScreen from './components/SetupScreen';
import MonthEditor from './components/MonthEditor';
import WizardNav from './components/WizardNav';
import SummaryScreen from './components/SummaryScreen';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import SEO from '../../components/SEO/SEO';
import styles from './CatCalendarPage.module.scss';

function initState(): CalendarState {
  try {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      const decoded = decodeCalendarState(data);
      if (decoded) return decoded;
    }
  } catch { /* ignore */ }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CalendarState;
      if (parsed.setup && Array.isArray(parsed.months) && parsed.months.length === 12) return parsed;
    }
  } catch { /* ignore */ }

  return buildFreshState();
}

export default function CatCalendarPage() {
  const [calState, setCalState] = useState<CalendarState>(initState);
  const [step, setStep] = useState<WizardStep>(() =>
    calState.setup.zipCode ? 'summary' : 'setup'
  );
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  // Track whether we're editing setup from summary (so we return there afterwards)
  const [returnToSummary, setReturnToSummary] = useState(false);

  const persistTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(calState));
        const encoded = encodeCalendarState(calState);
        window.history.replaceState({}, '', `?data=${encoded}`);
      } catch { /* ignore quota errors */ }
    }, 400);
    return () => clearTimeout(persistTimer.current);
  }, [calState]);


  const handleSetupComplete = useCallback(async (zip: string, unit: 'F' | 'C') => {
    setCalState(prev => ({
      ...prev,
      setup: { ...prev.setup, zipCode: zip, tempUnit: unit },
    }));
    setWeatherLoading(true);
    setWeatherError(null);
    // Go to month 0, or back to summary if editing
    setStep(returnToSummary ? 'summary' : 0);

    try {
      const { lat, lon, months: weatherMonths } = await fetchWeather(zip);
      setCalState(prev => ({
        ...prev,
        setup: { ...prev.setup, lat, lon },
        months: prev.months.map((m, i) => ({ ...m, weather: weatherMonths[i] })),
      }));
    } catch {
      setWeatherError('Could not fetch weather data. Temperatures will be empty.');
    } finally {
      setWeatherLoading(false);
      setReturnToSummary(false);
    }
  }, [returnToSummary]);

  const handleSkipWeather = useCallback((unit: 'F' | 'C') => {
    setCalState(prev => ({
      ...prev,
      setup: { ...prev.setup, zipCode: prev.setup.zipCode || 'skipped', tempUnit: unit },
    }));
    setStep(returnToSummary ? 'summary' : 0);
    setReturnToSummary(false);
  }, [returnToSummary]);

  const handleEditSetup = useCallback(() => {
    setReturnToSummary(true);
    setStep('setup');
  }, []);

  const updateMonth = useCallback((monthIndex: number, partial: Partial<MonthData>) => {
    setCalState(prev => ({
      ...prev,
      months: prev.months.map((m, i) => i === monthIndex ? { ...m, ...partial } : m),
    }));
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  }, []);

  const handleStartOver = useCallback(() => {
    if (window.confirm('Start over? This will clear your current calendar.')) {
      localStorage.removeItem(STORAGE_KEY);
      setCalState(buildFreshState());
      setStep('setup');
    }
  }, []);

  const monthIndex = typeof step === 'number' ? step : null;

  return (
    <div className={styles['cat-calendar']}>
      <SEO title="Cat Calendar Creator" description="Build a printable 12-month cat calendar with custom artwork, birthdays, events, and local weather." />
      <NavBar title="Cat Calendar Creator" className={styles['cat-calendar__nav']} />

      {step === 'setup' && (
        <SetupScreen
          initialUnit={calState.setup.tempUnit}
          initialZip={calState.setup.zipCode}
          loading={weatherLoading}
          error={weatherError}
          onComplete={handleSetupComplete}
          onSkip={handleSkipWeather}
        />
      )}

      {monthIndex !== null && (
        <>
          {weatherLoading && (
            <p style={{
              fontFamily: 'Inconsolata, monospace',
              fontSize: '0.85rem',
              color: '#9a8878',
              textAlign: 'center',
              padding: '0.5rem',
            }}>
              Fetching weather data…
            </p>
          )}
          {weatherError && (
            <p style={{
              fontFamily: 'Inconsolata, monospace',
              fontSize: '0.85rem',
              color: '#a04040',
              textAlign: 'center',
              padding: '0.5rem',
              background: '#fdf0f0',
            }}>
              {weatherError}
            </p>
          )}
          <MonthEditor
            monthData={calState.months[monthIndex]}
            tempUnit={calState.setup.tempUnit}
            onUpdate={(partial) => updateMonth(monthIndex, partial)}
          />
          <WizardNav
            step={step}
            onPrev={() => setStep(monthIndex === 0 ? 'setup' : monthIndex - 1)}
            onNext={() => setStep(monthIndex === 11 ? 'summary' : monthIndex + 1)}
            onJump={(i) => setStep(i)}
            onSummary={() => setStep('summary')}
          />
        </>
      )}

      {step === 'summary' && (
        <SummaryScreen
          calState={calState}
          onEditMonth={(i) => setStep(i)}
          onEditSetup={handleEditSetup}
          onStartOver={handleStartOver}
          onCopyLink={handleCopyLink}
          copySuccess={copySuccess}
        />
      )}
      <Footer projectSlug="cat-calendar" className={styles['cat-calendar__footer']} />
    </div>
  );
}
