import React, { useState, useEffect } from 'react';
import { IslamicPattern } from '../IslamicPattern';
import { CountdownTimer } from '../CountdownTimer';
import { getAdhkarForPrayer, type Dhikr } from '@/lib/adhkar';
import { type PrayerTime } from '@/lib/prayerTimes';

interface BetweenAdhanIqamaScreenProps {
  prayer: PrayerTime;
  timeToIqama: number;
  currentTime: Date;
}

export const BetweenAdhanIqamaScreen: React.FC<BetweenAdhanIqamaScreenProps> = ({
  prayer,
  timeToIqama,
  currentTime,
}) => {
  const [currentDhikr, setCurrentDhikr] = useState<Dhikr | null>(null);
  const [dhikrIndex, setDhikrIndex] = useState(0);
  
  const adhkar = getAdhkarForPrayer(prayer.nameAr, 'between-adhan-iqama');

  useEffect(() => {
    setCurrentDhikr(adhkar[dhikrIndex]);
  }, [dhikrIndex]);

  // Rotate adhkar every 25 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDhikrIndex(prev => (prev + 1) % adhkar.length);
    }, 25000);
    
    return () => clearInterval(interval);
  }, [adhkar.length]);

  return (
    <div className="min-h-screen bg-islamic flex flex-col relative overflow-x-hidden overflow-y-auto">
      <IslamicPattern opacity={0.04} />
      
      {/* Header with countdown */}
      <header className="relative z-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 text-center">
        <h2 className="font-arabic text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/80 mb-2 sm:mb-3 md:mb-4">
          باقي على إقامة صلاة {prayer.nameAr}
        </h2>
        <CountdownTimer
          milliseconds={timeToIqama}
          label=""
          size="large"
          variant="secondary"
        />
      </header>

      {/* Main content - Dhikr display */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-12">
        {currentDhikr && (
          <div 
            key={currentDhikr.id}
            className="w-full max-w-4xl text-center animate-fade-in-up"
          >
            {/* Decorative top */}
            <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center gap-2 sm:gap-4">
              <div className="w-12 sm:w-16 md:w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary/50" />
              <div className="w-12 sm:w-16 md:w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
            
            {/* Dhikr text - Card with padding for better readability */}
            <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-border/20">
              <p className="font-arabic text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-loose text-foreground whitespace-pre-wrap break-words">
                {currentDhikr.text}
              </p>
            </div>
            
            {/* Source */}
            {currentDhikr.source && (
              <p className="mt-4 sm:mt-6 md:mt-8 font-display text-sm sm:text-base md:text-lg text-muted-foreground">
                {currentDhikr.source}
              </p>
            )}
            
            {/* Decorative bottom */}
            <div className="mt-4 sm:mt-6 md:mt-8 flex items-center justify-center gap-2 sm:gap-4">
              <div className="w-12 sm:w-16 md:w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary/50" />
              <div className="w-12 sm:w-16 md:w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
          </div>
        )}
        
        {/* Progress dots */}
        <div className="mt-6 sm:mt-8 md:mt-12 flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
          {adhkar.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === dhikrIndex 
                  ? 'bg-secondary w-3 sm:w-4' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-t border-border/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <p className="font-arabic text-sm sm:text-base md:text-lg text-muted-foreground text-center sm:text-right">
            الدعاء بين الأذان والإقامة لا يُرد
          </p>
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
