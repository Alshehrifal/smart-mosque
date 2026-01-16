import React from 'react';
import { cn } from '@/lib/utils';
import { formatTimeRemaining } from '@/lib/prayerTimes';

interface CountdownTimerProps {
  milliseconds: number;
  label: string;
  size?: 'normal' | 'large';
  variant?: 'primary' | 'secondary' | 'muted';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  milliseconds,
  label,
  size = 'normal',
  variant = 'primary',
}) => {
  const timeString = formatTimeRemaining(milliseconds);
  const isUrgent = milliseconds < 60000; // Less than 1 minute

  return (
    <div className="flex flex-col items-center gap-3">
      <span 
        className={cn(
          'font-display text-muted-foreground',
          size === 'large' && 'text-3xl'
        )}
      >
        {label}
      </span>
      
      <div
        className={cn(
          'font-display font-bold tabular-nums tracking-wider',
          size === 'normal' && 'text-6xl',
          size === 'large' && 'text-8xl',
          variant === 'primary' && 'text-primary',
          variant === 'secondary' && 'text-secondary',
          variant === 'muted' && 'text-muted-foreground',
          isUrgent && 'animate-countdown-pulse text-secondary'
        )}
      >
        {timeString}
      </div>
    </div>
  );
};
