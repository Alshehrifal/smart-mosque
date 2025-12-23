// Prayer times calculation using the Umm al-Qura method
// This is a simplified calculation - for production, use a proper library

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
  latitude: number;
  longitude: number;
  calculationMethod: string;
  iqamaOffsets: Record<PrayerName, number>;
  prayerDuration: number; // minutes
  adhkarDuration: number; // minutes
}

// Default mosque settings
export const defaultSettings: MosqueSettings = {
  name: 'مسجد النور',
  city: 'الرياض',
  latitude: 24.7136,
  longitude: 46.6753,
  calculationMethod: 'UmmAlQura',
  iqamaOffsets: {
    fajr: 20,
    sunrise: 0,
    dhuhr: 15,
    asr: 15,
    maghrib: 5,
    isha: 15,
  },
  prayerDuration: 15,
  adhkarDuration: 5,
};

// Simplified prayer time calculation
// In production, use a proper library like adhan-js
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function calculatePrayerTimes(date: Date, settings: MosqueSettings): DailyPrayerTimes {
  const { latitude, longitude } = settings;
  
  // Get day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Calculate sun declination
  const declination = -23.45 * Math.cos(toRadians((360 / 365) * (dayOfYear + 10)));
  
  // Equation of time (simplified)
  const B = (360 / 365) * (dayOfYear - 81);
  const EoT = 9.87 * Math.sin(toRadians(2 * B)) - 7.53 * Math.cos(toRadians(B)) - 1.5 * Math.sin(toRadians(B));
  
  // Solar noon in minutes from midnight
  const solarNoon = 720 - 4 * longitude - EoT + (date.getTimezoneOffset() * -1);
  
  // Hour angle for different prayers
  const latRad = toRadians(latitude);
  const decRad = toRadians(declination);
  
  // Sunrise/Sunset hour angle
  const sunriseHA = toDegrees(Math.acos(-Math.tan(latRad) * Math.tan(decRad)));
  
  // Fajr angle (18 degrees below horizon for Umm al-Qura)
  const fajrAngle = 18.5;
  const fajrHA = toDegrees(Math.acos(
    (Math.sin(toRadians(-fajrAngle)) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad))
  ));
  
  // Isha angle (varies by calculation method)
  const ishaAngle = 17;
  const ishaHA = toDegrees(Math.acos(
    (Math.sin(toRadians(-ishaAngle)) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad))
  ));
  
  // Asr shadow length (Shafi'i: shadow = object + shadow at noon)
  const asrAngle = toDegrees(Math.atan(1 / (1 + Math.tan(Math.abs(latRad - decRad)))));
  const asrHA = toDegrees(Math.acos(
    (Math.sin(toRadians(90 - asrAngle)) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad))
  ));
  
  // Calculate times
  const fajrMinutes = solarNoon - fajrHA * 4;
  const sunriseMinutes = solarNoon - sunriseHA * 4;
  const dhuhrMinutes = solarNoon + 2; // Add 2 minutes after solar noon
  const asrMinutes = solarNoon + asrHA * 4;
  const maghribMinutes = solarNoon + sunriseHA * 4;
  const ishaMinutes = solarNoon + ishaHA * 4;
  
  const createTime = (minutes: number, name: string, nameAr: string, iqamaOffset: number): PrayerTime => {
    const time = new Date(date);
    time.setHours(0, 0, 0, 0);
    time.setMinutes(Math.round(minutes));
    return { name, nameAr, time, iqamaOffset };
  };
  
  return {
    fajr: createTime(fajrMinutes, 'Fajr', 'الفجر', settings.iqamaOffsets.fajr),
    sunrise: createTime(sunriseMinutes, 'Sunrise', 'الشروق', 0),
    dhuhr: createTime(dhuhrMinutes, 'Dhuhr', 'الظهر', settings.iqamaOffsets.dhuhr),
    asr: createTime(asrMinutes, 'Asr', 'العصر', settings.iqamaOffsets.asr),
    maghrib: createTime(maghribMinutes, 'Maghrib', 'المغرب', settings.iqamaOffsets.maghrib),
    isha: createTime(ishaMinutes, 'Isha', 'العشاء', settings.iqamaOffsets.isha),
  };
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

// Hijri date calculation (simplified)
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
