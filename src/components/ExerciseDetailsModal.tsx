import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { Exercise } from "@/data/types";
import { Plus, Dumbbell, Target, Users } from "lucide-react";

type ExerciseDetailsModalProps = {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onAddToDay?: () => void;
  showAddButton?: boolean;
};

const ExerciseDetailsModal = ({
  exercise,
  isOpen,
  onClose,
  onAddToDay,
  showAddButton = true
}: ExerciseDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] p-0">
        <DialogClose />
        
        {/* Header with Exercise Name */}
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-bold text-left">{exercise.name}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Exercise GIF */}
          <div className="relative">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={exercise.gifUrl}
                alt={`${exercise.name} demonstration`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex items-center justify-center h-full">
                        <div class="text-center">
                          <div class="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                              <circle cx="9" cy="9" r="2"/>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                          </div>
                          <p class="text-sm text-muted-foreground">Image not available</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>

          {/* Equipment */}
          {exercise.equipments && exercise.equipments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Equipment</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {exercise.equipments.map((equipment, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {equipment}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Primary Target Muscles */}
          {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Primary Target Muscles</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {exercise.targetMuscles.map((muscle, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs px-2 py-1 bg-red-50 text-red-700 border-red-200"
                  >
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Muscles */}
          {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Secondary Muscles</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {[...new Set(exercise.secondaryMuscles)].map((muscle, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs px-2 py-1 bg-orange-50 text-orange-700 border-orange-200"
                  >
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Body Parts */}
          {exercise.bodyParts && exercise.bodyParts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M12 15v6"/>
                  <path d="m8 9 4 4 4-4"/>
                </svg>
                <h3 className="font-semibold text-sm">Body Parts</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {exercise.bodyParts.map((part, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200"
                  >
                    {part}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Instructions</h3>
              <div className="space-y-2">
                {exercise.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Day Button */}
          {showAddButton && onAddToDay && (
            <div className="pt-4 border-t">
              <Button 
                onClick={() => {
                  onAddToDay();
                  onClose();
                }} 
                className="w-full"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Day
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDetailsModal;
