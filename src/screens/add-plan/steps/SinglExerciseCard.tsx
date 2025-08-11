import ExerciseDetailsModal from "@/components/ExerciseDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Exercise } from "@/data/types";
import { Plus, Info, Target, Users } from "lucide-react";
import { useState } from "react";

type SinglExerciseCardProps = {
    exercise: Exercise;
    onAddToDay?: () => void;
    showAddButton?: boolean;
}

const SinglExerciseCard = ({
    exercise,
    onAddToDay,
    showAddButton = true
}: SinglExerciseCardProps) => {
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const handleAddToDay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAddToDay) {
            onAddToDay();
        }
    };

    const handleShowDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDetailsModal(true);
    };

    return (
        <>
            <Card className="p-0 hover:shadow-md transition-all duration-200 border-2 hover:border-primary/20 hover:bg-primary/5 overflow-hidden">
                <div className="flex gap-3 p-3">
                    {/* Exercise GIF Thumbnail */}
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
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
                                                <svg class="h-6 w-6 text-muted-foreground opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                                    <circle cx="9" cy="9" r="2"/>
                                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                                </svg>
                                            </div>
                                        `;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Exercise Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">{exercise.name}</h3>
                        
                        {/* Primary Target Muscles */}
                        {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                            <div className="mb-2">
                                <div className="flex items-center gap-1 mb-1">
                                    <Target className="h-3 w-3 text-red-600" />
                                    <span className="text-xs font-medium text-muted-foreground">Primary:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {exercise.targetMuscles.slice(0, 2).map((muscle, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5 bg-red-50 text-red-700 border-red-200">
                                            {muscle}
                                        </Badge>
                                    ))}
                                    {exercise.targetMuscles.length > 2 && (
                                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-muted-foreground">
                                            +{exercise.targetMuscles.length - 2}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Secondary Muscles */}
                        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                            <div className="mb-2">
                                <div className="flex items-center gap-1 mb-1">
                                    <Users className="h-3 w-3 text-orange-600" />
                                    <span className="text-xs font-medium text-muted-foreground">Secondary:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {[...new Set(exercise.secondaryMuscles)].slice(0, 2).map((muscle, index) => (
                                        <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-700 border-orange-200">
                                            {muscle}
                                        </Badge>
                                    ))}
                                    {[...new Set(exercise.secondaryMuscles)].length > 2 && (
                                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-muted-foreground">
                                            +{[...new Set(exercise.secondaryMuscles)].length - 2}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Body Parts */}
                        <div>
                            <div className="flex flex-wrap gap-1">
                                {exercise.bodyParts.slice(0, 2).map(part => (
                                    <Badge key={part} variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 border-green-200">
                                        {part}
                                    </Badge>
                                ))}
                                {exercise.bodyParts.length > 2 && (
                                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-muted-foreground">
                                        +{exercise.bodyParts.length - 2}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShowDetails}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            title="View Details"
                        >
                            <Info className="h-4 w-4" />
                        </Button>
                        {showAddButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleAddToDay}
                                className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                                title="Add to Day"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Exercise Details Modal */}
            <ExerciseDetailsModal
                exercise={exercise}
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                onAddToDay={onAddToDay}
                showAddButton={showAddButton}
            />
        </>
    )
}

export default SinglExerciseCard