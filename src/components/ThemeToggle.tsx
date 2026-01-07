import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2 rtl:flex-row-reverse">
      <Sun className="h-4 w-4 text-secondary" />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="تبديل الوضع الليلي"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
