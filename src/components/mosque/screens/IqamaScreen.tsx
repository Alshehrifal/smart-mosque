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
    <div className="min-h-screen bg-islamic flex flex-col items-center justify-center relative overflow-hidden">
      <IslamicPattern opacity={0.06} />
      
      {/* Pulsing background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-secondary/30 via-transparent to-transparent animate-pulse-slow" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-8 animate-fade-in-up">
        {/* Decorative crescents */}
        <div className="mb-8 flex items-center justify-center gap-8">
          <svg className="w-12 h-12 text-secondary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2A10 10 0 0 0 5.3 17.3 10 10 0 0 1 12 2z"/>
          </svg>
          <div className="w-4 h-4 rounded-full bg-secondary animate-pulse" />
          <svg className="w-12 h-12 text-secondary transform scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2A10 10 0 0 0 5.3 17.3 10 10 0 0 1 12 2z"/>
          </svg>
        </div>
        
        {/* Main text */}
        <h1 className="font-arabic text-6xl md:text-8xl lg:text-9xl text-gradient-gold mb-6 animate-countdown-pulse">
          أقيمت الصلاة
        </h1>
        
        <h2 className="font-arabic text-4xl md:text-5xl text-foreground/90 mb-8">
          صلاة {prayer.nameAr}
        </h2>
        
        {/* Call to prayer */}
        <div className="mt-12 space-y-4">
          <p className="font-arabic text-2xl text-muted-foreground">
            قد قامت الصلاة قد قامت الصلاة
          </p>
          <p className="font-arabic text-xl text-primary/80">
            استووا واعتدلوا
          </p>
        </div>
        
        {/* Decorative line */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
          <div className="w-4 h-4 rounded-full bg-secondary/50 animate-pulse" />
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </div>
      </div>
      
      {/* Current time */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="font-display text-3xl text-foreground/60 tabular-nums">
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
