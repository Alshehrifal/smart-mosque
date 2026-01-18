import React from 'react';
import { usePrayerScheduler } from '@/hooks/usePrayerScheduler';
import { DashboardScreen } from './screens/DashboardScreen';
import { PreAdhanScreen } from './screens/PreAdhanScreen';
import { AdhanScreen } from './screens/AdhanScreen';
import { PostAdhanDuaScreen } from './screens/PostAdhanDuaScreen';
import { BetweenAdhanIqamaScreen } from './screens/BetweenAdhanIqamaScreen';
import { IqamaScreen } from './screens/IqamaScreen';
import { PrayerScreen } from './screens/PrayerScreen';
import { AdhkarScreen } from './screens/AdhkarScreen';
import { Button } from '@/components/ui/button';
import { Play, SkipForward, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface MosqueDisplayProps {
  demoMode?: boolean;
}

export const MosqueDisplay: React.FC<MosqueDisplayProps> = ({ 
  demoMode = false 
}) => {
  const [isDemoActive, setIsDemoActive] = React.useState(demoMode);
  const [showControls, setShowControls] = React.useState(true);
  
  const {
    currentTime,
    prayerTimes,
    nextPrayer,
    currentPrayer,
    screenState,
    timeToNextEvent,
    settings,
    hijriDate,
    advanceDemo,
  } = usePrayerScheduler(isDemoActive);

  const renderScreen = () => {
    const prayer = currentPrayer?.prayer || nextPrayer?.prayer;
    
    switch (screenState) {
      case 'pre-adhan':
        return prayer ? (
          <PreAdhanScreen
            prayer={prayer}
            timeToAdhan={timeToNextEvent}
            currentTime={currentTime}
          />
        ) : null;
        
      case 'adhan':
        return prayer ? (
          <AdhanScreen
            prayer={prayer}
            currentTime={currentTime}
          />
        ) : null;
        
      case 'post-adhan-dua':
        return prayer ? (
          <PostAdhanDuaScreen
            prayer={prayer}
            currentTime={currentTime}
          />
        ) : null;
        
      case 'between-adhan-iqama':
        return prayer ? (
          <BetweenAdhanIqamaScreen
            prayer={prayer}
            timeToIqama={timeToNextEvent}
            totalIqamaTime={prayer.iqamaOffset * 60 * 1000}
            currentTime={currentTime}
          />
        ) : null;
        
      case 'iqama':
        return prayer ? (
          <IqamaScreen
            prayer={prayer}
            currentTime={currentTime}
          />
        ) : null;
        
      case 'prayer':
        return prayer ? (
          <PrayerScreen prayer={prayer} />
        ) : null;
        
      case 'adhkar':
        return prayer ? (
          <AdhkarScreen
            prayer={prayer}
            currentTime={currentTime}
          />
        ) : null;
        
      case 'dashboard':
      default:
        return (
          <DashboardScreen
            currentTime={currentTime}
            prayerTimes={prayerTimes}
            nextPrayer={nextPrayer}
            timeToNextEvent={timeToNextEvent}
            mosqueName={settings.name}
            hijriDate={hijriDate}
          />
        );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Theme toggle - top left */}
      <div className="fixed top-6 left-6 z-50 p-3 bg-card/90 backdrop-blur-sm rounded-xl border border-border/50">
        <ThemeToggle />
      </div>

      {/* Main display - Full screen TV optimized */}
      <div className="w-full h-screen">
        {renderScreen()}
      </div>
      
      {/* Demo controls - TV optimized */}
      {showControls && (
        <div className="fixed bottom-8 left-8 z-50 flex items-center gap-4 p-4 bg-card/90 backdrop-blur-sm rounded-2xl border border-border/50">
          <Button
            variant={isDemoActive ? "default" : "outline"}
            size="lg"
            onClick={() => setIsDemoActive(!isDemoActive)}
            className="gap-3 text-xl px-6 py-6"
          >
            <Play className="w-6 h-6" />
            {isDemoActive ? 'إيقاف' : 'تجريبي'}
          </Button>
          
          {isDemoActive && (
            <Button
              variant="outline"
              size="lg"
              onClick={advanceDemo}
              className="gap-3 text-xl px-6 py-6"
            >
              <SkipForward className="w-6 h-6" />
              التالي
            </Button>
          )}
          
          <span className="px-4 text-xl text-muted-foreground font-display">
            {screenState === 'dashboard' && 'الرئيسية'}
            {screenState === 'pre-adhan' && 'قبل الأذان'}
            {screenState === 'adhan' && 'الأذان'}
            {screenState === 'post-adhan-dua' && 'دعاء بعد الأذان'}
            {screenState === 'between-adhan-iqama' && 'بين الأذان والإقامة'}
            {screenState === 'iqama' && 'الإقامة'}
            {screenState === 'prayer' && 'الصلاة'}
            {screenState === 'adhkar' && 'الأذكار'}
          </span>
        </div>
      )}
      
      {/* Toggle controls button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-card/50 backdrop-blur-sm rounded-full border border-border/30 text-muted-foreground hover:text-foreground transition-colors"
      >
        {showControls ? <EyeOff className="w-8 h-8" /> : <Eye className="w-8 h-8" />}
      </button>
    </div>
  );
};
