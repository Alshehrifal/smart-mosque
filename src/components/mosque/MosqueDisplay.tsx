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
          />
        );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main display */}
      <div className="w-full h-full">
        {renderScreen()}
      </div>
      
      {/* Demo controls */}
      {showControls && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 p-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border/50">
          <Button
            variant={isDemoActive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsDemoActive(!isDemoActive)}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isDemoActive ? 'إيقاف العرض' : 'وضع تجريبي'}
          </Button>
          
          {isDemoActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={advanceDemo}
              className="gap-2"
            >
              <SkipForward className="w-4 h-4" />
              التالي
            </Button>
          )}
          
          <span className="px-2 text-sm text-muted-foreground font-display">
            {screenState === 'dashboard' && 'الشاشة الرئيسية'}
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
        className="fixed bottom-4 right-4 z-50 p-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/30 text-muted-foreground hover:text-foreground transition-colors"
      >
        {showControls ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
};
