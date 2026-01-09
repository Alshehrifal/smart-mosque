import React from 'react';
import { cn } from '@/lib/utils';
import { formatTime, type PrayerTime } from '@/lib/prayerTimes';

interface PrayerTimeCardProps {
  prayer: PrayerTime;
  isNext: boolean;
  isCurrent: boolean;
}

export const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({
  prayer,
  isNext,
  isCurrent,
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl transition-all duration-500',
        'border border-border/50 backdrop-blur-sm min-h-[80px] sm:min-h-[100px] md:min-h-[120px]',
        isNext && 'bg-primary/20 border-primary/50 glow-primary scale-105',
        isCurrent && 'bg-secondary/20 border-secondary/50 glow-gold',
        !isNext && !isCurrent && 'bg-card/50 hover:bg-card/80'
      )}
    >
      {/* Glow effect for next prayer */}
      {isNext && (
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-primary/10 animate-glow" />
      )}
      
      <h3 
        className={cn(
          'font-arabic text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-1 sm:mb-2 transition-colors',
          isNext && 'text-primary',
          isCurrent && 'text-secondary',
          !isNext && !isCurrent && 'text-foreground/80'
        )}
      >
        {prayer.nameAr}
      </h3>
      
      <p 
        className={cn(
          'font-display text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tabular-nums',
          isNext && 'text-primary',
          isCurrent && 'text-secondary',
          !isNext && !isCurrent && 'text-foreground'
        )}
      >
        {formatTime(prayer.time)}
      </p>
      
      {isNext && (
        <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-primary/80 font-display">
          الصلاة القادمة
        </span>
      )}
    </div>
  );
};
