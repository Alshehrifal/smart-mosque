import React from 'react';
import { IslamicPattern } from '../IslamicPattern';
import { formatTime, type PrayerTime } from '@/lib/prayerTimes';

interface AdhanScreenProps {
  prayer: PrayerTime;
  currentTime: Date;
}

export const AdhanScreen: React.FC<AdhanScreenProps> = ({
  prayer,
  currentTime,
}) => {
  return (
    <div className="min-h-screen bg-islamic flex flex-col items-center justify-center relative overflow-hidden">
      <IslamicPattern opacity={0.06} />
      
      {/* Radial glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-8 animate-fade-in-up">
        {/* Decorative element */}
        <div className="mb-8">
          <svg 
            className="w-24 h-24 mx-auto text-secondary animate-float" 
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 5 L55 35 L85 40 L60 55 L65 85 L50 65 L35 85 L40 55 L15 40 L45 35 Z" />
          </svg>
        </div>
        
        {/* Prayer Name */}
        <h1 className="font-arabic text-5xl md:text-7xl lg:text-8xl text-gradient-gold mb-6">
          حان الآن
        </h1>
        
        <h2 className="font-arabic text-6xl md:text-8xl lg:text-9xl text-primary mb-8 animate-pulse-slow">
          أذان {prayer.nameAr}
        </h2>
        
        {/* Time */}
        <p className="font-display text-4xl md:text-5xl text-foreground/80 tabular-nums">
          {formatTime(prayer.time)}
        </p>
        
        {/* Decorative line */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
          <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </div>
        
        <p className="mt-8 font-arabic text-2xl text-muted-foreground">
          الله أكبر الله أكبر
        </p>
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
