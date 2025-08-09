import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface PWAUpdateNotificationProps {
  className?: string;
}

export function PWAUpdateNotification({ className = '' }: PWAUpdateNotificationProps) {
  const { isUpdateAvailable, skipWaiting } = usePWA();

  if (!isUpdateAvailable) {
    return null;
  }

  const handleUpdate = () => {
    skipWaiting();
  };

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 ${className}`}>
      <div className="bg-background border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">Update Available</h3>
            <p className="text-xs text-muted-foreground mt-1">
              A new version of GymFlow is ready to install
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            onClick={handleUpdate}
            className="flex-1 h-8 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Update Now
          </Button>
        </div>
      </div>
    </div>
  );
}
