import { useState, useEffect, useCallback } from 'react';
import {
  calculatePrayerTimes,
  getPrayerTimesWithCache,
  getNextPrayer,
  getCurrentActivePrayer,
  defaultSettings,
  type DailyPrayerTimes,
  type PrayerTime,
  type PrayerName,
  type ScreenState,
  type MosqueSettings,
} from '@/lib/prayerTimes';

interface SchedulerState {
  currentTime: Date;
  prayerTimes: DailyPrayerTimes;
  nextPrayer: { prayer: PrayerTime; name: PrayerName } | null;
  currentPrayer: { prayer: PrayerTime; name: PrayerName } | null;
  screenState: ScreenState;
  timeToNextEvent: number; // milliseconds
  settings: MosqueSettings;
  hijriDate: string;
  isLoading: boolean;
}

export function usePrayerScheduler(demoMode: boolean = false) {
  const [state, setState] = useState<SchedulerState>(() => {
    const now = new Date();
    const prayerTimes = calculatePrayerTimes(now, defaultSettings);
    const nextPrayer = getNextPrayer(prayerTimes, now);
    
    return {
      currentTime: now,
      prayerTimes,
      nextPrayer,
      currentPrayer: null,
      screenState: 'dashboard',
      timeToNextEvent: nextPrayer ? nextPrayer.prayer.time.getTime() - now.getTime() : 0,
      settings: defaultSettings,
      hijriDate: '',
      isLoading: true,
    };
  });

  const [demoState, setDemoState] = useState<ScreenState>('dashboard');
  const [demoPrayerIndex, setDemoPrayerIndex] = useState(0);

  const demoPrayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  const advanceDemo = useCallback(() => {
    const states: ScreenState[] = [
      'dashboard',
      'pre-adhan',
      'adhan',
      'post-adhan-dua',
      'between-adhan-iqama',
      'iqama',
      'prayer',
      'adhkar',
    ];
    
    setDemoState(current => {
      const currentIndex = states.indexOf(current);
      const nextIndex = (currentIndex + 1) % states.length;
      
      if (nextIndex === 0) {
        setDemoPrayerIndex(prev => (prev + 1) % demoPrayers.length);
      }
      
      return states[nextIndex];
    });
  }, []);

  // Fetch prayer times from API on mount and when date changes
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const result = await getPrayerTimesWithCache(state.settings);
        const now = new Date();
        const nextPrayer = getNextPrayer(result.prayerTimes, now);
        
        setState(prev => ({
          ...prev,
          prayerTimes: result.prayerTimes,
          hijriDate: result.hijriDate,
          nextPrayer,
          isLoading: false,
        }));
        
        console.log('Prayer times loaded from API:', result.prayerTimes);
      } catch (error) {
        console.error('Failed to fetch prayer times:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchPrayerTimes();
    
    // Refresh at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 5, 0, 0); // 00:05 AM
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimeout = setTimeout(() => {
      fetchPrayerTimes();
    }, msUntilMidnight);
    
    return () => clearTimeout(midnightTimeout);
  }, [state.settings]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (demoMode) return;
      
      const now = new Date();
      const nextPrayer = getNextPrayer(state.prayerTimes, now);
      const activePrayer = getCurrentActivePrayer(state.prayerTimes, now, state.settings);
      
      // Determine screen state based on time
      let screenState: ScreenState = 'dashboard';
      let currentPrayer = state.currentPrayer;
      let timeToNextEvent = 0;
      
      // Check if we're in an active prayer cycle
      if (activePrayer) {
        const adhanTime = activePrayer.prayer.time.getTime();
        const iqamaTime = adhanTime + activePrayer.prayer.iqamaOffset * 60000;
        const timeToAdhan = adhanTime - now.getTime();
        const timeToIqama = iqamaTime - now.getTime();
        
        // Pre-adhan (5 minutes before)
        if (timeToAdhan > 0 && timeToAdhan <= 5 * 60 * 1000) {
          screenState = 'pre-adhan';
          timeToNextEvent = timeToAdhan;
          currentPrayer = activePrayer;
        }
        // Adhan time (first 3 minutes after adhan time)
        else if (timeToAdhan <= 0 && timeToAdhan > -3 * 60 * 1000) {
          screenState = 'adhan';
          timeToNextEvent = timeToIqama;
          currentPrayer = activePrayer;
        }
        // Post-adhan dua (30 seconds after adhan ends, i.e., 3-3.5 min after adhan)
        else if (timeToAdhan <= -3 * 60 * 1000 && timeToAdhan > -3.5 * 60 * 1000) {
          screenState = 'post-adhan-dua';
          timeToNextEvent = timeToIqama;
          currentPrayer = activePrayer;
        }
        // Between adhan and iqama
        else if (timeToAdhan <= -3.5 * 60 * 1000 && timeToIqama > 0) {
          screenState = 'between-adhan-iqama';
          timeToNextEvent = timeToIqama;
          currentPrayer = activePrayer;
        }
        // Iqama time (1 minute)
        else if (timeToIqama <= 0 && timeToIqama > -1 * 60 * 1000) {
          screenState = 'iqama';
          timeToNextEvent = -timeToIqama + state.settings.prayerDuration * 60 * 1000;
          currentPrayer = activePrayer;
        }
        // During prayer (8 minutes from iqama)
        else if (timeToIqama <= -1 * 60 * 1000 && 
                 timeToIqama > -(1 + 8) * 60 * 1000) {
          screenState = 'prayer';
          const prayerEndTime = iqamaTime + (1 + 8) * 60 * 1000;
          timeToNextEvent = prayerEndTime - now.getTime();
          currentPrayer = activePrayer;
        }
        // Adhkar after prayer (starts 8 minutes after iqama)
        else if (timeToIqama <= -(1 + 8) * 60 * 1000 &&
                 timeToIqama > -(1 + 8 + state.settings.adhkarDuration) * 60 * 1000) {
          screenState = 'adhkar';
          const adhkarEndTime = iqamaTime + 
            (1 + 8 + state.settings.adhkarDuration) * 60 * 1000;
          timeToNextEvent = adhkarEndTime - now.getTime();
          currentPrayer = activePrayer;
        }
      }
      // Not in an active prayer cycle - show dashboard
      else if (nextPrayer) {
        screenState = 'dashboard';
        timeToNextEvent = nextPrayer.prayer.time.getTime() - now.getTime();
        currentPrayer = null;
      }
      
      setState(prev => ({
        ...prev,
        currentTime: now,
        nextPrayer,
        currentPrayer,
        screenState,
        timeToNextEvent,
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state.prayerTimes, state.settings, state.currentPrayer, demoMode]);

  // Demo mode auto-advance
  useEffect(() => {
    if (!demoMode) return;
    
    const interval = setInterval(() => {
      advanceDemo();
    }, 5000); // Change state every 5 seconds in demo mode
    
    return () => clearInterval(interval);
  }, [demoMode, advanceDemo]);

  const getCurrentPrayerForDemo = useCallback(() => {
    const prayerName = demoPrayers[demoPrayerIndex];
    return {
      prayer: state.prayerTimes[prayerName],
      name: prayerName,
    };
  }, [demoPrayerIndex, state.prayerTimes]);

  if (demoMode) {
    const demoPrayer = getCurrentPrayerForDemo();
    return {
      ...state,
      screenState: demoState,
      currentPrayer: demoPrayer,
      nextPrayer: demoPrayer,
      advanceDemo,
    };
  }

  return {
    ...state,
    advanceDemo: () => {},
  };
}
