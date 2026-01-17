import React from 'react';
import { PrayerTimeCard } from '../PrayerTimeCard';
import { CountdownTimer } from '../CountdownTimer';
import { IslamicPattern } from '../IslamicPattern';
import { 
  getGregorianDate, 
  getHijriDate,
  formatTime,
  type DailyPrayerTimes,
  type PrayerTime,
  type PrayerName,
} from '@/lib/prayerTimes';

interface DashboardScreenProps {
  currentTime: Date;
  prayerTimes: DailyPrayerTimes;
  nextPrayer: { prayer: PrayerTime; name: PrayerName } | null;
  timeToNextEvent: number;
  mosqueName: string;
  hijriDate?: string;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentTime,
  prayerTimes,
  nextPrayer,
  timeToNextEvent,
  mosqueName,
  hijriDate,
}) => {
  const prayers: { prayer: PrayerTime; name: PrayerName }[] = [
    { prayer: prayerTimes.fajr, name: 'fajr' },
    { prayer: prayerTimes.sunrise, name: 'sunrise' },
    { prayer: prayerTimes.dhuhr, name: 'dhuhr' },
    { prayer: prayerTimes.asr, name: 'asr' },
    { prayer: prayerTimes.maghrib, name: 'maghrib' },
    { prayer: prayerTimes.isha, name: 'isha' },
  ];

  return (
    <div className="h-screen bg-islamic flex flex-col relative overflow-hidden">
      <IslamicPattern opacity={0.04} />
      

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-12 py-8">
        {/* Next Prayer Section */}
        {nextPrayer && nextPrayer.name !== 'sunrise' && (
          <div className="mb-16 text-center animate-fade-in-up">
            <h2 className="font-arabic text-4xl text-foreground/80 mb-6">
              الصلاة القادمة: {nextPrayer.prayer.nameAr}
            </h2>
            {/* Countdown Timer - Only show when 30 minutes or less remaining */}
            {timeToNextEvent <= 30 * 60 * 1000 && (
              <CountdownTimer
                milliseconds={timeToNextEvent}
                label="الوقت المتبقي"
                size="large"
                variant="primary"
              />
            )}
            {/* Prayer Time */}
            <p className={`font-display text-4xl text-foreground/90 tabular-nums ${timeToNextEvent <= 30 * 60 * 1000 ? 'mt-6' : 'mt-0'}`}>
              {formatTime(nextPrayer.prayer.time)}
            </p>
            {/* Hijri Date */}
            <p className="mt-4 font-arabic text-2xl text-muted-foreground">
              {hijriDate || getHijriDate(currentTime)}
            </p>
          </div>
        )}

        {/* Prayer Times Grid - 6 columns for TV */}
        <div className="w-full max-w-[1800px] px-8">
          <div className="grid grid-cols-6 gap-8">
            {prayers.map(({ prayer, name }) => (
              <PrayerTimeCard
                key={name}
                prayer={prayer}
                isNext={nextPrayer?.name === name}
                isCurrent={false}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-12 py-6 border-t border-border/30">
        <div className="flex flex-col items-center gap-3">
          <p className="font-display text-7xl font-bold text-foreground tabular-nums">
            {currentTime.toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
          </p>
          {/* Gregorian Date */}
          <p className="font-display text-2xl text-muted-foreground">
            {getGregorianDate(currentTime)}
          </p>
        </div>
      </footer>
    </div>
  );
};
