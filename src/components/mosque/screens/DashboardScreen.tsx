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
    <div className="min-h-screen bg-islamic flex flex-col relative overflow-x-hidden overflow-y-auto">
      <IslamicPattern opacity={0.04} />
      
      {/* Header - Mosque Name only */}
      <header className="relative z-10 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 border-b border-border/30">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-arabic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gradient-gold">
            {mosqueName}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-12">
        {/* Next Prayer Section */}
        {nextPrayer && nextPrayer.name !== 'sunrise' && (
          <div className="mb-6 sm:mb-8 md:mb-12 text-center animate-fade-in-up w-full max-w-lg">
            <h2 className="font-arabic text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/80 mb-2 sm:mb-3 md:mb-4">
              الصلاة القادمة: {nextPrayer.prayer.nameAr}
            </h2>
            {/* Countdown Timer */}
            <CountdownTimer
              milliseconds={timeToNextEvent}
              label="الوقت المتبقي"
              size="large"
              variant="primary"
            />
            {/* Prayer Time */}
            <p className="mt-2 sm:mt-3 md:mt-4 font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/90 tabular-nums">
              {formatTime(nextPrayer.prayer.time)}
            </p>
            {/* Hijri Date */}
            <p className="mt-1 sm:mt-2 font-arabic text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground">
              {hijriDate || getHijriDate(currentTime)}
            </p>
          </div>
        )}

        {/* Prayer Times Grid */}
        <div className="w-full max-w-6xl px-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
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
      <footer className="relative z-10 px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-t border-border/30">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-1 sm:gap-2">
          <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground tabular-nums">
            {currentTime.toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </p>
          {/* Gregorian Date */}
          <p className="font-display text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">
            {getGregorianDate(currentTime)}
          </p>
        </div>
      </footer>
    </div>
  );
};
