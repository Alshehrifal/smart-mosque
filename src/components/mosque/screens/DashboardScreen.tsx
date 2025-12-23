import React from 'react';
import { PrayerTimeCard } from '../PrayerTimeCard';
import { CountdownTimer } from '../CountdownTimer';
import { IslamicPattern } from '../IslamicPattern';
import { 
  getGregorianDate, 
  getHijriDate,
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
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentTime,
  prayerTimes,
  nextPrayer,
  timeToNextEvent,
  mosqueName,
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
    <div className="min-h-screen bg-islamic flex flex-col relative overflow-hidden">
      <IslamicPattern opacity={0.04} />
      
      {/* Header */}
      <header className="relative z-10 px-8 py-6 border-b border-border/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Mosque Name */}
          <div className="text-center md:text-right">
            <h1 className="font-arabic text-3xl md:text-4xl text-gradient-gold">
              {mosqueName}
            </h1>
          </div>
          
          {/* Date Display */}
          <div className="text-center md:text-left space-y-1">
            <p className="font-display text-lg text-foreground">
              {getGregorianDate(currentTime)}
            </p>
            <p className="font-arabic text-muted-foreground">
              {getHijriDate(currentTime)}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Next Prayer Countdown */}
        {nextPrayer && nextPrayer.name !== 'sunrise' && (
          <div className="mb-12 text-center animate-fade-in-up">
            <h2 className="font-arabic text-2xl md:text-3xl text-foreground/80 mb-4">
              الصلاة القادمة: {nextPrayer.prayer.nameAr}
            </h2>
            <CountdownTimer
              milliseconds={timeToNextEvent}
              label="الوقت المتبقي"
              size="large"
              variant="primary"
            />
          </div>
        )}

        {/* Prayer Times Grid */}
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
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
      <footer className="relative z-10 px-8 py-4 border-t border-border/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="font-display text-5xl md:text-6xl font-bold text-foreground tabular-nums">
            {currentTime.toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </p>
        </div>
      </footer>
    </div>
  );
};
