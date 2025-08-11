import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Exercise } from "@/data/types";
import { Plus } from "lucide-react";

type SinglExerciseCardProps = {
    exercise: Exercise
}

const SinglExerciseCard = ({
    exercise
}: SinglExerciseCardProps) => {
    return (
        <Card
            key={exercise.exerciseId}
            className="p-3 hover:shadow-md transition-all duration-200 cursor-pointer border-2 hover:border-primary/30 hover:bg-primary/5"
            onClick={() => {
                // addExerciseToDay(selectedDayIndex!, exercise);
                // setIsFilterDrawerOpen(false);
                // clearAllFilters();
            }}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{exercise.name}</h3>
                    <div className="flex flex-wrap gap-1">
                        {exercise.bodyParts.slice(0, 3).map(part => (
                            <Badge key={part} variant="secondary" className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200">
                                {part}
                            </Badge>
                        ))}
                        {exercise.bodyParts.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground">
                                +{exercise.bodyParts.length - 3}
                            </Badge>
                        )}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        // addExerciseToDay(selectedDayIndex!, exercise);
                        // setIsFilterDrawerOpen(false);
                        // clearAllFilters();
                    }}
                    className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10 ml-2 flex-shrink-0"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    )
}

export default SinglExerciseCard