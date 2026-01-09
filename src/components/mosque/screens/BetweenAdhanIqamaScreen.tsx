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
    <div className="min-h-screen bg-islamic flex flex-col relative overflow-hidden">
      <IslamicPattern opacity={0.04} />
      
      {/* Header with countdown */}
      <header className="relative z-10 px-8 py-8 text-center">
        <h2 className="font-arabic text-2xl md:text-3xl text-foreground/80 mb-4">
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
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-12">
        {currentDhikr && (
          <div 
            key={currentDhikr.id}
            className="max-w-4xl text-center animate-fade-in-up"
          >
            {/* Decorative top */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
            
            {/* Dhikr text */}
            <p className="font-arabic text-3xl md:text-4xl lg:text-5xl leading-relaxed text-foreground whitespace-pre-wrap break-words">
              {currentDhikr.text}
            </p>
            
            {/* Source */}
            {currentDhikr.source && (
              <p className="mt-8 font-display text-lg text-muted-foreground">
                {currentDhikr.source}
              </p>
            )}
            
            {/* Decorative bottom */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
          </div>
        )}
        
        {/* Progress dots */}
        <div className="mt-12 flex items-center gap-2">
          {adhkar.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === dhikrIndex 
                  ? 'bg-secondary w-4' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 border-t border-border/30">
        <div className="flex items-center justify-between">
          <p className="font-arabic text-lg text-muted-foreground">
            الدعاء بين الأذان والإقامة لا يُرد
          </p>
          <p className="font-display text-3xl text-foreground/60 tabular-nums">
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
