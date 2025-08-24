import ExerciseDetailsModal from "@/components/exercise-details-modal/exercise-details-modal"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Exercise } from "@/data/types"
import { capitalizeFirst } from "@/lib/string-helper"
import { Eye, Plus } from "lucide-react"
import { useState } from "react"

type PlanDetailsExerciseCardProps = {
  exercise: Exercise
  onAddToLog: (exerciseId: string) => void
}

const PlanDetailsExerciseCard = ({ exercise, onAddToLog }: PlanDetailsExerciseCardProps) => {

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  return (
    <>
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/40 hover:border-primary/30 transition-all !p-2">
        <CardContent className="px-2 py-4">
          <div className="flex items-start gap-3">
            {/* Exercise Image */}
            <div className="w-16 h-16 rounded-lg bg-muted/50 flex-shrink-0 overflow-hidden">
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Exercise Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-1">
                {capitalizeFirst(exercise.name)}
              </h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {exercise.targetMuscles.slice(0, 3).map((muscle, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {capitalizeFirst(muscle)}
                  </Badge>
                ))}
                {exercise.targetMuscles.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{exercise.targetMuscles.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 flex-shrink-0 items-center">
              <button
                type="button"
                aria-label="View exercise details"
                className="rounded-full p-2 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary transition"
                onClick={() => setIsDetailsModalOpen(true)}
              >
                <Eye className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                type="button"
                aria-label="Add exercise to log"
                className="rounded-full p-2 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary transition"
                onClick={() => onAddToLog(exercise.exerciseId)}
              >
                <Plus className="h-4 w-4 text-primary" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ExerciseDetailsModal
        exercise={exercise}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
        }}
      />
    </>
  )
}

export default PlanDetailsExerciseCard