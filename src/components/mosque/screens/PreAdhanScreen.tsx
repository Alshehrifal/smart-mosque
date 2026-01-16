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
    <div className="h-screen bg-islamic flex flex-col items-center justify-center relative overflow-hidden">
      <IslamicPattern opacity={0.05} />
      
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-16 animate-fade-in-up">
        {/* Bell icon */}
        <div className="mb-12">
          <svg 
            className="w-28 h-28 mx-auto text-secondary animate-float" 
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
        <h1 className="font-arabic text-6xl text-foreground mb-8">
          اقترب موعد
        </h1>
        
        <h2 className="font-arabic text-8xl text-gradient-gold mb-12">
          أذان {prayer.nameAr}
        </h2>
        
        {/* Countdown */}
        <div className="mt-12">
          <CountdownTimer
            milliseconds={timeToAdhan}
            label="الوقت المتبقي"
            size="large"
            variant="primary"
          />
        </div>
        
        {/* Reminder */}
        <p className="mt-16 font-arabic text-3xl text-muted-foreground">
          استعدوا للصلاة
        </p>
      </div>
      
      {/* Current time */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <p className="font-display text-4xl text-foreground/60 tabular-nums">
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
