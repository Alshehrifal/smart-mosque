// Prayer times using AlAdhan API with Umm al-Qura method

import { supabase } from "@/integrations/supabase/client";

export interface PrayerTime {
  name: string;
  nameAr: string;
  time: Date;
  iqamaOffset: number; // minutes after adhan
}

export interface DailyPrayerTimes {
  fajr: PrayerTime;
  sunrise: PrayerTime;
  dhuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
}

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type ScreenState = 
  | 'dashboard'
  | 'pre-adhan'
  | 'adhan'
  | 'post-adhan-dua'
  | 'between-adhan-iqama'
  | 'iqama'
  | 'prayer'
  | 'adhkar';

export interface MosqueSettings {
  name: string;
  city: string;
  country: string;
  calculationMethod: string; // AlAdhan method ID
  school: string; // 0 = Shafi, 1 = Hanafi
  iqamaOffsets: Record<PrayerName, number>;
  prayerDuration: number; // minutes
  adhkarDuration: number; // minutes
}

// Default mosque settings - Jeddah with Umm Al-Qura method
export const defaultSettings: MosqueSettings = {
  name: 'مسجد النور',
  city: 'Jeddah',
  country: 'Saudi Arabia',
  calculationMethod: '4', // Umm Al-Qura
  school: '0', // Shafi
  iqamaOffsets: {
    fajr: 29,
    sunrise: 0,
    dhuhr: 24,
    asr: 24,
    maghrib: 14,
    isha: 24,
  },
  prayerDuration: 8.5, // 8 minutes 30 seconds
  adhkarDuration: 5,
};

// Cache for prayer times - now stores multiple days
interface DayPrayerData {
  prayerTimes: DailyPrayerTimes;
  hijriDate: string;
}

interface WeeklyPrayerTimesCache {
  fetchedAt: string; // ISO date when data was fetched
  days: Record<string, DayPrayerData>; // key: DD-MM-YYYY
}

const STORAGE_KEY = 'mosque_prayer_times_weekly_cache';

// Format date to DD-MM-YYYY (matching API format)
function formatDateKey(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
}

// Parse time string (HH:MM) to Date object for a specific date
function parseTimeStringForDate(timeStr: string, dateKey: string, offsetMinutes: number = 0): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const [day, month, year] = dateKey.split('-').map(Number);
  const result = new Date(year, month - 1, day, hours, minutes + offsetMinutes, 0, 0);
  return result;
}

// Load cache from localStorage
function loadCacheFromStorage(): WeeklyPrayerTimesCache | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Convert date strings back to Date objects for each day
    const days: Record<string, DayPrayerData> = {};
    for (const [dateKey, dayData] of Object.entries(parsed.days)) {
      const data = dayData as any;
      days[dateKey] = {
        prayerTimes: {
          fajr: { ...data.prayerTimes.fajr, time: new Date(data.prayerTimes.fajr.time) },
          sunrise: { ...data.prayerTimes.sunrise, time: new Date(data.prayerTimes.sunrise.time) },
          dhuhr: { ...data.prayerTimes.dhuhr, time: new Date(data.prayerTimes.dhuhr.time) },
          asr: { ...data.prayerTimes.asr, time: new Date(data.prayerTimes.asr.time) },
          maghrib: { ...data.prayerTimes.maghrib, time: new Date(data.prayerTimes.maghrib.time) },
          isha: { ...data.prayerTimes.isha, time: new Date(data.prayerTimes.isha.time) },
        },
        hijriDate: data.hijriDate,
      };
    }
    
    return {
      fetchedAt: parsed.fetchedAt,
      days,
    };
  } catch (error) {
    console.warn('Failed to load prayer times from storage:', error);
    return null;
  }
}

// Save cache to localStorage
function saveCacheToStorage(cache: WeeklyPrayerTimesCache): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    console.log('Saved prayer times for', Object.keys(cache.days).length, 'days to storage');
  } catch (error) {
    console.warn('Failed to save prayer times to storage:', error);
  }
}

let weeklyCache: WeeklyPrayerTimesCache | null = loadCacheFromStorage();

// Get today's date key
function getTodayKey(): string {
  return formatDateKey(new Date());
}

// Parse time string (HH:MM) to Date object with optional offset (legacy support)
function parseTimeString(timeStr: string, date: Date, offsetMinutes: number = 0): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes + offsetMinutes, 0, 0);
  return result;
}

// Convert API timings to DailyPrayerTimes for a specific date
function convertTimingsToPrayerTimes(
  timings: { Fajr: string; Sunrise: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string },
  dateKey: string,
  settings: MosqueSettings
): DailyPrayerTimes {
  const adhanOffset = 1; // +1 minute per Umm al-Qura calendar adjustment
  
  return {
    fajr: {
      name: 'Fajr',
      nameAr: 'الفجر',
      time: parseTimeStringForDate(timings.Fajr, dateKey, adhanOffset),
      iqamaOffset: settings.iqamaOffsets.fajr,
    },
    sunrise: {
      name: 'Sunrise',
      nameAr: 'الشروق',
      time: parseTimeStringForDate(timings.Sunrise, dateKey, adhanOffset),
      iqamaOffset: 0,
    },
    dhuhr: {
      name: 'Dhuhr',
      nameAr: 'الظهر',
      time: parseTimeStringForDate(timings.Dhuhr, dateKey, adhanOffset),
      iqamaOffset: settings.iqamaOffsets.dhuhr,
    },
    asr: {
      name: 'Asr',
      nameAr: 'العصر',
      time: parseTimeStringForDate(timings.Asr, dateKey, adhanOffset),
      iqamaOffset: settings.iqamaOffsets.asr,
    },
    maghrib: {
      name: 'Maghrib',
      nameAr: 'المغرب',
      time: parseTimeStringForDate(timings.Maghrib, dateKey, adhanOffset),
      iqamaOffset: settings.iqamaOffsets.maghrib,
    },
    isha: {
      name: 'Isha',
      nameAr: 'العشاء',
      time: parseTimeStringForDate(timings.Isha, dateKey, adhanOffset),
      iqamaOffset: settings.iqamaOffsets.isha,
    },
  };
}

// Fetch prayer times for a week from API via edge function
export async function fetchWeeklyPrayerTimesFromAPI(settings: MosqueSettings): Promise<WeeklyPrayerTimesCache | null> {
  try {
    const { data, error } = await supabase.functions.invoke('get-prayer-times', {
      body: null,
    });

    if (error) {
      console.error('Error fetching prayer times:', error);
      return null;
    }

    if (!data.success) {
      console.error('API error:', data.error);
      return null;
    }

    const days: Record<string, DayPrayerData> = {};
    
    // Process each day from the response
    for (const dateKey of data.dates) {
      const dayData = data.data[dateKey];
      if (dayData) {
        const hijri = dayData.date.hijri;
        days[dateKey] = {
          prayerTimes: convertTimingsToPrayerTimes(dayData.timings, dateKey, settings),
          hijriDate: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
        };
      }
    }

    console.log('Fetched prayer times for', Object.keys(days).length, 'days');
    
    return {
      fetchedAt: new Date().toISOString(),
      days,
    };
  } catch (error) {
    console.error('Error fetching weekly prayer times:', error);
    return null;
  }
}

// Calculate prayer times with weekly caching
export async function getPrayerTimesWithCache(settings: MosqueSettings): Promise<{ prayerTimes: DailyPrayerTimes; hijriDate: string }> {
  const todayKey = getTodayKey();
  
  // Check if we have today's data in cache
  if (weeklyCache && weeklyCache.days[todayKey]) {
    console.log('Using cached prayer times for', todayKey);
    const cached = weeklyCache.days[todayKey];
    return { prayerTimes: cached.prayerTimes, hijriDate: cached.hijriDate };
  }
  
  // Try to fetch a new week of prayer times
  const result = await fetchWeeklyPrayerTimesFromAPI(settings);
  
  if (result) {
    weeklyCache = result;
    saveCacheToStorage(weeklyCache);
    
    // Return today's data
    if (result.days[todayKey]) {
      const todayData = result.days[todayKey];
      return { prayerTimes: todayData.prayerTimes, hijriDate: todayData.hijriDate };
    }
  }
  
  // Fallback to local calculation if API fails
  console.warn('API failed, using fallback calculation');
  return { prayerTimes: calculatePrayerTimesFallback(new Date(), settings), hijriDate: getHijriDate(new Date()) };
}

// Fallback local calculation (simplified)
function calculatePrayerTimesFallback(date: Date, settings: MosqueSettings): DailyPrayerTimes {
  // Default times for Jeddah as fallback
  const defaultTimes = {
    fajr: '05:30',
    sunrise: '06:50',
    dhuhr: '12:20',
    asr: '15:35',
    maghrib: '18:05',
    isha: '19:35',
  };
  
  return {
    fajr: {
      name: 'Fajr',
      nameAr: 'الفجر',
      time: parseTimeString(defaultTimes.fajr, date),
      iqamaOffset: settings.iqamaOffsets.fajr,
    },
    sunrise: {
      name: 'Sunrise',
      nameAr: 'الشروق',
      time: parseTimeString(defaultTimes.sunrise, date),
      iqamaOffset: 0,
    },
    dhuhr: {
      name: 'Dhuhr',
      nameAr: 'الظهر',
      time: parseTimeString(defaultTimes.dhuhr, date),
      iqamaOffset: settings.iqamaOffsets.dhuhr,
    },
    asr: {
      name: 'Asr',
      nameAr: 'العصر',
      time: parseTimeString(defaultTimes.asr, date),
      iqamaOffset: settings.iqamaOffsets.asr,
    },
    maghrib: {
      name: 'Maghrib',
      nameAr: 'المغرب',
      time: parseTimeString(defaultTimes.maghrib, date),
      iqamaOffset: settings.iqamaOffsets.maghrib,
    },
    isha: {
      name: 'Isha',
      nameAr: 'العشاء',
      time: parseTimeString(defaultTimes.isha, date),
      iqamaOffset: settings.iqamaOffsets.isha,
    },
  };
}

// Synchronous fallback for initial state (before API loads)
export function calculatePrayerTimes(date: Date, settings: MosqueSettings): DailyPrayerTimes {
  return calculatePrayerTimesFallback(date, settings);
}

export function getNextPrayer(prayerTimes: DailyPrayerTimes, currentTime: Date): { prayer: PrayerTime; name: PrayerName } | null {
  const prayers: { prayer: PrayerTime; name: PrayerName }[] = [
    { prayer: prayerTimes.fajr, name: 'fajr' },
    { prayer: prayerTimes.sunrise, name: 'sunrise' },
    { prayer: prayerTimes.dhuhr, name: 'dhuhr' },
    { prayer: prayerTimes.asr, name: 'asr' },
    { prayer: prayerTimes.maghrib, name: 'maghrib' },
    { prayer: prayerTimes.isha, name: 'isha' },
  ];
  
  for (const p of prayers) {
    if (p.prayer.time > currentTime) {
      return p;
    }
  }
  
  return null; // All prayers passed, next is tomorrow's Fajr
}

// Get the current active prayer (the one we're in the middle of its adhan/iqama/prayer cycle)
export function getCurrentActivePrayer(
  prayerTimes: DailyPrayerTimes, 
  currentTime: Date, 
  settings: { prayerDuration: number; adhkarDuration: number }
): { prayer: PrayerTime; name: PrayerName } | null {
  const prayers: { prayer: PrayerTime; name: PrayerName }[] = [
    { prayer: prayerTimes.fajr, name: 'fajr' },
    { prayer: prayerTimes.dhuhr, name: 'dhuhr' },
    { prayer: prayerTimes.asr, name: 'asr' },
    { prayer: prayerTimes.maghrib, name: 'maghrib' },
    { prayer: prayerTimes.isha, name: 'isha' },
  ];
  
  for (const p of prayers) {
    const adhanTime = p.prayer.time.getTime();
    const iqamaTime = adhanTime + p.prayer.iqamaOffset * 60000;
    const prayerEndTime = iqamaTime + (1 + settings.prayerDuration + settings.adhkarDuration) * 60000;
    
    // Check if we're currently in this prayer's cycle (from 5 min before adhan to end of adhkar)
    const preAdhanStart = adhanTime - 5 * 60000;
    
    if (currentTime.getTime() >= preAdhanStart && currentTime.getTime() <= prayerEndTime) {
      return p;
    }
  }
  
  return null;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatTimeRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

// Hijri date calculation (fallback using browser API)
export function getHijriDate(date: Date): string {
  try {
    return date.toLocaleDateString('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export function getGregorianDate(date: Date): string {
  return date.toLocaleDateString('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
