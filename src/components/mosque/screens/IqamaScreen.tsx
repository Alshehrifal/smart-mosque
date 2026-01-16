import React from 'react';
import { IslamicPattern } from '../IslamicPattern';
import { type PrayerTime } from '@/lib/prayerTimes';

interface IqamaScreenProps {
  prayer: PrayerTime;
  currentTime: Date;
}

export const IqamaScreen: React.FC<IqamaScreenProps> = ({
  prayer,
  currentTime,
}) => {
  return (
    <div className="h-screen bg-islamic flex flex-col items-center justify-center relative overflow-hidden">
      <IslamicPattern opacity={0.06} />
      
      {/* Pulsing background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-secondary/30 via-transparent to-transparent animate-pulse-slow" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-16 animate-fade-in-up">
        {/* Decorative crescents */}
        <div className="mb-12 flex items-center justify-center gap-12">
          <svg className="w-20 h-20 text-secondary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2A10 10 0 0 0 5.3 17.3 10 10 0 0 1 12 2z"/>
          </svg>
          <div className="w-6 h-6 rounded-full bg-secondary animate-pulse" />
          <svg className="w-20 h-20 text-secondary transform scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2A10 10 0 0 0 5.3 17.3 10 10 0 0 1 12 2z"/>
          </svg>
        </div>
        
        {/* Main text */}
        <h1 className="font-arabic text-9xl text-gradient-gold mb-10 animate-countdown-pulse">
          أقيمت الصلاة
        </h1>
        
        <h2 className="font-arabic text-6xl text-foreground/90 mb-12">
          صلاة {prayer.nameAr}
        </h2>
        
        {/* Call to prayer */}
        <div className="mt-16 space-y-6">
          <p className="font-arabic text-4xl text-muted-foreground">
            قد قامت الصلاة قد قامت الصلاة
          </p>
          <p className="font-arabic text-3xl text-primary/80">
            استووا واعتدلوا
          </p>
        </div>
        
        {/* Decorative line */}
        <div className="mt-20 flex items-center justify-center gap-6">
          <div className="w-40 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
          <div className="w-6 h-6 rounded-full bg-secondary/50 animate-pulse" />
          <div className="w-40 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </div>
      </div>
      
      {/* Current time */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <p className="font-display text-5xl text-foreground/60 tabular-nums">
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
