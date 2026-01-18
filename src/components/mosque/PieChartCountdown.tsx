import React from 'react';

interface PieChartCountdownProps {
  remainingMs: number;
  totalMs: number;
  size?: number;
  strokeWidth?: number;
}

export const PieChartCountdown: React.FC<PieChartCountdownProps> = ({
  remainingMs,
  totalMs,
  size = 280,
  strokeWidth = 20,
}) => {
  // Calculate percentage remaining
  const percentage = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
  const elapsed = 100 - percentage;
  
  // SVG circle calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - elapsed / 100);
  
  // Format time remaining
  const formatTime = (ms: number): { minutes: string; seconds: string } => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    // Convert to Arabic numerals
    const toArabicNumerals = (num: number): string => {
      const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return num.toString().padStart(2, '0').replace(/\d/g, (d) => arabicDigits[parseInt(d)]);
    };
    
    return {
      minutes: toArabicNumerals(minutes),
      seconds: toArabicNumerals(seconds),
    };
  };
  
  const { minutes, seconds } = formatTime(remainingMs);
  
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg
        className="absolute transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          className="opacity-30"
        />
        
        {/* Progress circle (elapsed time) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
        
        {/* Remaining time indicator arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - strokeDashoffset}
          className="transition-all duration-1000 ease-linear opacity-80"
        />
      </svg>
      
      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span className="font-display text-6xl font-bold text-foreground tabular-nums tracking-wider">
          {minutes}:{seconds}
        </span>
        <span className="font-arabic text-xl text-muted-foreground mt-2">
          باقي للإقامة
        </span>
      </div>
    </div>
  );
};
