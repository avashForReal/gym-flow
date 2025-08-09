import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface ManualInstallButtonProps {
  className?: string;
}

export function ManualInstallButton({ className = '' }: ManualInstallButtonProps) {
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Button
        onClick={installApp}
        size="sm"
        className="h-12 w-12 rounded-full shadow-lg"
        title="Install GymFlow"
      >
        <Download className="h-5 w-5" />
      </Button>
    </div>
  );
}
