import React from 'react';
import { IslamicPattern } from '../IslamicPattern';
import { CountdownTimer } from '../CountdownTimer';
import { type PrayerTime } from '@/lib/prayerTimes';

interface PreAdhanScreenProps {
  prayer: PrayerTime;
  timeToAdhan: number;
  currentTime: Date;
}

export const PreAdhanScreen: React.FC<PreAdhanScreenProps> = ({
  prayer,
  timeToAdhan,
  currentTime,
}) => {
  return (
    <div className="min-h-screen bg-islamic flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto">
      <IslamicPattern opacity={0.05} />
      
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 animate-fade-in-up w-full max-w-3xl py-8">
        {/* Bell icon */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <svg 
            className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 mx-auto text-secondary animate-float" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        
        {/* Main text */}
        <h1 className="font-arabic text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground mb-3 sm:mb-4 md:mb-6">
          اقترب موعد
        </h1>
        
        <h2 className="font-arabic text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gradient-gold mb-4 sm:mb-6 md:mb-8">
          أذان {prayer.nameAr}
        </h2>
        
        {/* Countdown */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          <CountdownTimer
            milliseconds={timeToAdhan}
            label="الوقت المتبقي"
            size="large"
            variant="primary"
          />
        </div>
        
        {/* Reminder */}
        <p className="mt-6 sm:mt-8 md:mt-12 font-arabic text-base sm:text-lg md:text-xl text-muted-foreground">
          استعدوا للصلاة
        </p>
      </div>
      
      {/* Current time */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2">
        <p className="font-display text-xl sm:text-2xl md:text-3xl text-foreground/60 tabular-nums">
          {currentTime.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })}
        </p>
      </div>
    </div>
  );
};
