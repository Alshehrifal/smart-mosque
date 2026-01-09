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
    fajr: 25,
    sunrise: 0,
    dhuhr: 20,
    asr: 20,
    maghrib: 10,
    isha: 20,
  },
  prayerDuration: 15,
  adhkarDuration: 5,
};

// Cache for prayer times
interface PrayerTimesCache {
  date: string;
  data: DailyPrayerTimes;
  hijriDate: string;
}

let prayerTimesCache: PrayerTimesCache | null = null;

// Parse time string (HH:MM) to Date object
function parseTimeString(timeStr: string, date: Date): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

// Get today's date string for cache key
function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// Fetch prayer times from AlAdhan API via edge function
export async function fetchPrayerTimesFromAPI(settings: MosqueSettings): Promise<{ prayerTimes: DailyPrayerTimes; hijriDate: string } | null> {
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

    const timings = data.data.timings;
    const today = new Date();
    
    const prayerTimes: DailyPrayerTimes = {
      fajr: {
        name: 'Fajr',
        nameAr: 'الفجر',
        time: parseTimeString(timings.Fajr, today),
        iqamaOffset: settings.iqamaOffsets.fajr,
      },
      sunrise: {
        name: 'Sunrise',
        nameAr: 'الشروق',
        time: parseTimeString(timings.Sunrise, today),
        iqamaOffset: 0,
      },
      dhuhr: {
        name: 'Dhuhr',
        nameAr: 'الظهر',
        time: parseTimeString(timings.Dhuhr, today),
        iqamaOffset: settings.iqamaOffsets.dhuhr,
      },
      asr: {
        name: 'Asr',
        nameAr: 'العصر',
        time: parseTimeString(timings.Asr, today),
        iqamaOffset: settings.iqamaOffsets.asr,
      },
      maghrib: {
        name: 'Maghrib',
        nameAr: 'المغرب',
        time: parseTimeString(timings.Maghrib, today),
        iqamaOffset: settings.iqamaOffsets.maghrib,
      },
      isha: {
        name: 'Isha',
        nameAr: 'العشاء',
        time: parseTimeString(timings.Isha, today),
        iqamaOffset: settings.iqamaOffsets.isha,
      },
    };

    // Get Hijri date from response
    const hijri = data.data.date.hijri;
    const hijriDate = `${hijri.day} ${hijri.month.ar} ${hijri.year}`;

    return { prayerTimes, hijriDate };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

// Calculate prayer times with caching
export async function getPrayerTimesWithCache(settings: MosqueSettings): Promise<{ prayerTimes: DailyPrayerTimes; hijriDate: string }> {
  const todayKey = getTodayKey();
  
  // Check cache
  if (prayerTimesCache && prayerTimesCache.date === todayKey) {
    console.log('Using cached prayer times');
    return { prayerTimes: prayerTimesCache.data, hijriDate: prayerTimesCache.hijriDate };
  }
  
  // Fetch from API
  const result = await fetchPrayerTimesFromAPI(settings);
  
  if (result) {
    // Update cache
    prayerTimesCache = {
      date: todayKey,
      data: result.prayerTimes,
      hijriDate: result.hijriDate,
    };
    return result;
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
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
