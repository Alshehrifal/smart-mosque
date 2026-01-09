import React from 'react';
import { usePrayerScheduler } from '@/hooks/usePrayerScheduler';
import { DashboardScreen } from './screens/DashboardScreen';
import { PreAdhanScreen } from './screens/PreAdhanScreen';
import { AdhanScreen } from './screens/AdhanScreen';
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
        
      case 'between-adhan-iqama':
        return prayer ? (
          <BetweenAdhanIqamaScreen
            prayer={prayer}
            timeToIqama={timeToNextEvent}
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
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background">
      {/* Theme toggle - top left with safe area */}
      <div className="fixed top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-50 p-1.5 sm:p-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border/50">
        <ThemeToggle />
      </div>

      {/* Main display */}
      <div className="w-full min-h-screen">
        {renderScreen()}
      </div>
      
      {/* Demo controls */}
      {showControls && (
        <div className="fixed bottom-16 sm:bottom-4 left-2 sm:left-3 md:left-4 z-50 flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border/50 max-w-[calc(100vw-4rem)] sm:max-w-none">
          <div className="flex items-center gap-2">
            <Button
              variant={isDemoActive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsDemoActive(!isDemoActive)}
              className="gap-1 sm:gap-2 text-xs sm:text-sm min-h-[40px] px-2 sm:px-3"
            >
              <Play className="w-3 sm:w-4 h-3 sm:h-4" />
              {isDemoActive ? 'إيقاف' : 'تجريبي'}
            </Button>
            
            {isDemoActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={advanceDemo}
                className="gap-1 sm:gap-2 text-xs sm:text-sm min-h-[40px] px-2 sm:px-3"
              >
                <SkipForward className="w-3 sm:w-4 h-3 sm:h-4" />
                التالي
              </Button>
            )}
          </div>
          
          <span className="px-1 sm:px-2 text-xs sm:text-sm text-muted-foreground font-display">
            {screenState === 'dashboard' && 'الرئيسية'}
            {screenState === 'pre-adhan' && 'قبل الأذان'}
            {screenState === 'adhan' && 'الأذان'}
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
        className="fixed bottom-4 right-2 sm:right-3 md:right-4 z-50 p-2 sm:p-2.5 bg-card/50 backdrop-blur-sm rounded-full border border-border/30 text-muted-foreground hover:text-foreground transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
      >
        {showControls ? <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" /> : <Eye className="w-4 sm:w-5 h-4 sm:h-5" />}
      </button>
    </div>
  );
};
