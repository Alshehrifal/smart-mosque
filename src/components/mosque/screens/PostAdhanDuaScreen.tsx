import React from 'react';
import { IslamicPattern } from '../IslamicPattern';
import { type PrayerTime } from '@/lib/prayerTimes';

interface PostAdhanDuaScreenProps {
  prayer: PrayerTime;
  currentTime: Date;
}

export const PostAdhanDuaScreen: React.FC<PostAdhanDuaScreenProps> = ({
  prayer,
  currentTime,
}) => {
  return (
    <div className="h-screen bg-islamic flex flex-col items-center justify-center relative overflow-hidden">
      <IslamicPattern opacity={0.05} />
      
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-radial from-secondary/15 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-16 animate-fade-in-up max-w-[1400px]">
        {/* Decorative element */}
        <div className="mb-12 flex items-center justify-center gap-6">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
          <div className="w-4 h-4 rounded-full bg-secondary/50" />
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </div>
        
        {/* Title */}
        <h2 className="font-arabic text-4xl text-muted-foreground mb-10">
          دعاء بعد الأذان
        </h2>
        
        {/* Dua text */}
        <div className="p-12 border border-secondary/20 rounded-3xl bg-card/30 backdrop-blur-sm">
          <p className="font-arabic text-4xl leading-loose text-foreground">
            اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ القَائِمَةِ، آتِ مُحَمَّدًا الوَسِيلَةَ وَالفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
          </p>
        </div>
        
        {/* Source */}
        <p className="mt-8 font-display text-2xl text-muted-foreground">
          رواه البخاري
        </p>
        
        {/* Decorative element */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
          <div className="w-4 h-4 rounded-full bg-secondary/50" />
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </div>
      </div>
      
      {/* Current time */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <p className="font-display text-4xl text-foreground/60 tabular-nums">
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })}
        </p>
      </div>
    </div>
  );
};
