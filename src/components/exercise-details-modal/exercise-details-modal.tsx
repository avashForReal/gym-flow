import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { Exercise } from "@/data/types";
import { Dumbbell, Target, Users } from "lucide-react";
import ExerciseGif from "@/components/exercise-gif/exercise-gif";
import { capitalizeFirst } from "@/lib/string-helper";

type ExerciseDetailsModalProps = {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
};

const ExerciseDetailsModal = ({
  exercise,
  isOpen,
  onClose,
}: ExerciseDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[400px] max-h-[85vh] p-0 flex flex-col">
        <div className="absolute top-2 right-2 z-10">
          <DialogClose />
        </div>
        <DialogHeader className="p-4 pb-2 border-b border-border flex flex-col items-center">
          <DialogTitle className="text-lg font-semibold text-center w-full break-words">{capitalizeFirst(exercise.name)}</DialogTitle>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 custom-scrollbar">
          <div className="w-40 h-40 mx-auto">
            <ExerciseGif
              gifUrl={exercise.gifUrl}
              name={exercise.name}
              twClassName="w-full h-full object-cover rounded"
            />
          </div>
          {/* Grouped Info Grid */}
          <div className="grid grid-cols-2 gap-2">
            {exercise.equipments?.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Dumbbell className="h-3 w-3 text-muted-foreground" />
                  <h3 className="font-semibold text-xs">Equipment</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {exercise.equipments.map((e, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] px-1 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                      {capitalizeFirst(e)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {exercise.targetMuscles?.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Target className="h-3 w-3 text-muted-foreground" />
                  <h3 className="font-semibold text-xs">Primary</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {exercise.targetMuscles.map((m, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0.5 bg-red-50 text-red-700 border-red-200">
                      {capitalizeFirst(m)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {exercise.secondaryMuscles?.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <h3 className="font-semibold text-xs">Secondary</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {[...new Set(exercise.secondaryMuscles)].map((m, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] px-1 py-0.5 bg-orange-50 text-orange-700 border-orange-200">
                      {capitalizeFirst(m)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {exercise.bodyParts?.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M12 15v6" />
                    <path d="m8 9 4 4 4-4" />
                  </svg>
                  <h3 className="font-semibold text-xs">Body</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {exercise.bodyParts.map((p, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0.5 bg-green-50 text-green-700 border-green-200">
                      {capitalizeFirst(p)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {exercise.instructions?.length > 0 && (
            <div>
              <h3 className="font-semibold text-xs mb-1">Instructions</h3>
              <div className="space-y-1">
                {exercise.instructions.map((instruction, i) => {
                  // Find and highlight "Step: X" at the start of the instruction
                  const match = instruction.match(/^(Step:\s*\d+)(.*)$/i);
                  return (
                    <div key={i} className="flex items-start">
                      {match ? (
                        <p className="text-xs leading-snug">
                          <span className="text-primary font-bold">{match[1]}</span>
                          <span className="text-muted-foreground font-normal">{match[2]}</span>
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground leading-snug">{instruction}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDetailsModal;
