import React from 'react';
import { IslamicPattern } from '../IslamicPattern';
import { type PrayerTime } from '@/lib/prayerTimes';

interface PrayerScreenProps {
  prayer: PrayerTime;
}

export const PrayerScreen: React.FC<PrayerScreenProps> = ({ prayer }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Very subtle pattern */}
      <IslamicPattern opacity={0.02} />
      
      {/* Content - Very calm and minimal */}
      <div className="relative z-10 text-center px-8">
        {/* Simple decorative element */}
        <div className="mb-12 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-primary/30" />
        </div>
        
        {/* Main text */}
        <h1 className="font-arabic text-4xl md:text-5xl text-foreground/60">
          الصلاة قائمة
        </h1>
        
        <p className="mt-6 font-arabic text-2xl text-muted-foreground/50">
          {prayer.nameAr}
        </p>
        
        {/* Simple decorative element */}
        <div className="mt-12 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-primary/30" />
        </div>
      </div>
    </div>
  );
};
