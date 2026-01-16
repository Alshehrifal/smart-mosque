import React from 'react';
import { IslamicPattern } from '../IslamicPattern';
import { type PrayerTime } from '@/lib/prayerTimes';
import { Smartphone } from 'lucide-react';

interface PrayerScreenProps {
  prayer: PrayerTime;
}

export const PrayerScreen: React.FC<PrayerScreenProps> = ({ prayer }) => {
  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Very subtle pattern */}
      <IslamicPattern opacity={0.02} />
      
      {/* Content - Very calm and minimal */}
      <div className="relative z-10 text-center px-16">
        {/* Simple decorative element */}
        <div className="mb-16 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
        
        {/* Main text */}
        <h1 className="font-arabic text-7xl text-foreground/60">
          الصلاة قائمة
        </h1>
        
        <p className="mt-10 font-arabic text-5xl text-muted-foreground/50">
          {prayer.nameAr}
        </p>

        {/* Silent mode reminder */}
        <div className="mt-20 flex items-center justify-center gap-6 bg-primary/5 px-12 py-6 rounded-2xl border border-primary/10">
          <Smartphone className="w-10 h-10 text-primary/40" />
          <p className="font-arabic text-3xl text-foreground/50">
            ضعوا الجوالات على الصامت
          </p>
        </div>
        
        {/* Simple decorative element */}
        <div className="mt-16 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
      </div>
    </div>
  );
};
