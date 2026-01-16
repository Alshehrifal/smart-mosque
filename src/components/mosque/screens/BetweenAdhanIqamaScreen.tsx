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
    <div className="h-screen bg-islamic flex flex-col relative overflow-hidden">
      <IslamicPattern opacity={0.04} />
      
      {/* Header with countdown */}
      <header className="relative z-10 px-12 py-10 text-center">
        <h2 className="font-arabic text-4xl text-foreground/80 mb-6">
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
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-16 py-8">
        {currentDhikr && (
          <div 
            key={currentDhikr.id}
            className="w-full max-w-[1600px] text-center animate-fade-in-up"
          >
            {/* Decorative top */}
            <div className="mb-10 flex items-center justify-center gap-6">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="w-3 h-3 rounded-full bg-primary/50" />
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
            
            {/* Dhikr text - Card with padding for better readability */}
            <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-12 border border-border/20">
              <p className="font-arabic text-5xl leading-loose text-foreground whitespace-pre-wrap break-words">
                {currentDhikr.text}
              </p>
            </div>
            
            {/* Source */}
            {currentDhikr.source && (
              <p className="mt-10 font-display text-2xl text-muted-foreground">
                {currentDhikr.source}
              </p>
            )}
            
            {/* Decorative bottom */}
            <div className="mt-10 flex items-center justify-center gap-6">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="w-3 h-3 rounded-full bg-primary/50" />
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
          </div>
        )}
        
        {/* Progress dots */}
        <div className="mt-12 flex items-center gap-3">
          {adhkar.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === dhikrIndex 
                  ? 'bg-secondary w-8' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-12 py-6 border-t border-border/30">
        <div className="flex items-center justify-between">
          <p className="font-arabic text-2xl text-muted-foreground">
            الدعاء بين الأذان والإقامة لا يُرد
          </p>
          <p className="font-display text-4xl text-foreground/60 tabular-nums">
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
