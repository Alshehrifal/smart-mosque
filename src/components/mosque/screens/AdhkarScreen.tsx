import React, { useState, useEffect } from 'react';
import { IslamicPattern } from '../IslamicPattern';
import { afterPrayerAdhkar, type Dhikr } from '@/lib/adhkar';
import { type PrayerTime } from '@/lib/prayerTimes';

interface AdhkarScreenProps {
  prayer: PrayerTime;
  currentTime: Date;
}

export const AdhkarScreen: React.FC<AdhkarScreenProps> = ({
  prayer,
  currentTime,
}) => {
  const [currentDhikr, setCurrentDhikr] = useState<Dhikr | null>(null);
  const [dhikrIndex, setDhikrIndex] = useState(0);

  useEffect(() => {
    setCurrentDhikr(afterPrayerAdhkar[dhikrIndex]);
  }, [dhikrIndex]);

  // Rotate adhkar every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDhikrIndex(prev => (prev + 1) % afterPrayerAdhkar.length);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-islamic flex flex-col relative overflow-x-hidden overflow-y-auto">
      <IslamicPattern opacity={0.04} />
      
      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 border-b border-border/30">
        <div className="text-center">
          <h1 className="font-arabic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gradient-gold">
            أذكار بعد صلاة {prayer.nameAr}
          </h1>
        </div>
      </header>

      {/* Main content - Dhikr display */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-12">
        {currentDhikr && (
          <div 
            key={currentDhikr.id}
            className="w-full max-w-4xl text-center animate-fade-in-up"
          >
            {/* Decorative frame */}
            <div className="relative p-4 sm:p-6 md:p-8 lg:p-12 border border-primary/20 rounded-2xl sm:rounded-3xl bg-card/30 backdrop-blur-sm">
              {/* Corner decorations */}
              <div className="absolute top-0 right-0 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-t-2 border-r-2 border-secondary/50 rounded-tr-2xl sm:rounded-tr-3xl" />
              <div className="absolute top-0 left-0 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-t-2 border-l-2 border-secondary/50 rounded-tl-2xl sm:rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-b-2 border-r-2 border-secondary/50 rounded-br-2xl sm:rounded-br-3xl" />
              <div className="absolute bottom-0 left-0 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-b-2 border-l-2 border-secondary/50 rounded-bl-2xl sm:rounded-bl-3xl" />
              
              {/* Dhikr text */}
              <p className="font-arabic text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-loose text-foreground whitespace-pre-wrap break-words">
                {currentDhikr.text}
              </p>
              
              {/* Source */}
              {currentDhikr.source && (
                <p className="mt-3 sm:mt-4 md:mt-6 font-display text-xs sm:text-sm md:text-base text-muted-foreground">
                  {currentDhikr.source}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Progress indicator */}
        <div className="mt-4 sm:mt-6 md:mt-8 flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
          {afterPrayerAdhkar.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === dhikrIndex 
                  ? 'bg-primary w-3 sm:w-4' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-t border-border/30">
        <div className="flex items-center justify-center">
          <p className="font-display text-xl sm:text-2xl md:text-3xl text-foreground/60 tabular-nums">
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
