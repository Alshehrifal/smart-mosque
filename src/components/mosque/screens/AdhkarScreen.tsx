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
    <div className="min-h-screen bg-islamic flex flex-col relative overflow-hidden">
      <IslamicPattern opacity={0.04} />
      
      {/* Header */}
      <header className="relative z-10 px-8 py-6 border-b border-border/30">
        <div className="text-center">
          <h1 className="font-arabic text-3xl md:text-4xl text-gradient-gold">
            أذكار بعد صلاة {prayer.nameAr}
          </h1>
        </div>
      </header>

      {/* Main content - Dhikr display */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-12">
        {currentDhikr && (
          <div 
            key={currentDhikr.id}
            className="max-w-4xl text-center animate-fade-in-up"
          >
            {/* Decorative frame */}
            <div className="relative p-8 md:p-12 border border-primary/20 rounded-3xl bg-card/30 backdrop-blur-sm">
              {/* Corner decorations */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary/50 rounded-tr-3xl" />
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary/50 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/50 rounded-br-3xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary/50 rounded-bl-3xl" />
              
              {/* Dhikr text */}
              <p className="font-arabic text-2xl md:text-3xl lg:text-4xl leading-relaxed text-foreground whitespace-pre-line">
                {currentDhikr.text}
              </p>
              
              {/* Source */}
              {currentDhikr.source && (
                <p className="mt-6 font-display text-base text-muted-foreground">
                  {currentDhikr.source}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Progress indicator */}
        <div className="mt-8 flex items-center gap-2">
          {afterPrayerAdhkar.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === dhikrIndex 
                  ? 'bg-primary w-4' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 border-t border-border/30">
        <div className="flex items-center justify-center">
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
