import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="text-6xl">🏋️‍♂️</div>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Let's set up your profile so we can personalize your workout experience and track your progress effectively.
        </p>
      </div>


      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Track workouts</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Monitor progress</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Set PRs</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Stay motivated</span>
          </div>
        </div>
      </div>

      <Button
        onClick={onNext}
        className="modern-btn bg-gradient-to-r from-primary to-accent text-white border-0 px-8"
        size="lg"
      >
        Let's Get Started! 🚀
      </Button>
    </div>
  );
}