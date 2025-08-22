import ExerciseGif from "@/components/exercise-gif/exercise-gif";
import ExerciseDetailsModal from "@/components/exercise-details-modal/exercise-details-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Exercise } from "@/data/types";
import { capitalizeFirst } from "@/lib/string-helper";
import { Eye, X } from "lucide-react";
import { useState } from "react";

type SinglExerciseCardProps = {
    exercise: Exercise;
    onAddToDay: () => void;
    onRemoveFromDay: () => void;
    isSelected: boolean
    isDayList?: boolean
}

const SinglExerciseCard = ({
    exercise,
    onAddToDay,
    onRemoveFromDay,
    isSelected,
    isDayList = false
}: SinglExerciseCardProps) => {
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const handleToggleAddToDay = (e: React.MouseEvent) => {
        if (isDayList) return;
        if (!isSelected) {
            handleAddToDay(e);
        } else {
            handleRemoveFromDay(e);
        }
    };

    const handleAddToDay = (e: React.MouseEvent) => {
        e.stopPropagation()
        onAddToDay();
    };

    const handleRemoveFromDay = (e: React.MouseEvent) => {
        e.stopPropagation()
        onRemoveFromDay();
    };

    const handleShowDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDetailsModal(true);
    };

    return (
        <>
            <Card
                onClick={handleToggleAddToDay}
                className={`!py-2 group relative overflow-hidden border bg-white hover:shadow-sm transition-all duration-50 rounded-xl cursor-pointer
                    ${isSelected
                        ? "border-2 border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.15)]"
                        : "border-gray-200"
                    }
                `}
                style={isSelected ? { boxShadow: "0 0 0 2px rgba(59,130,246,0.15)" } : undefined}
            >
                <div className="p-2">
                    <div className="flex items-center gap-4">
                        {/* Exercise Thumbnail - Smaller */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <ExerciseGif
                                    gifUrl={exercise.gifUrl}
                                    name={exercise.name}
                                    twClassName="w-9 h-9 rounded border border-gray-100 shadow-sm"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex items-start justify-end gap-2 w-full">
                            {/* Main Content Area */}
                            <div className="flex flex-col w-3/4">
                                {/* Header with title and actions */}
                                <div className="flex items-start justify-between mb-1.5">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-xs leading-tight truncate mb-0.5" title={exercise.name}>
                                            {capitalizeFirst(exercise.name)}
                                        </h3>
                                        {/* Equipment info as subtitle */}
                                        {exercise.equipments && exercise.equipments.length > 0 && (
                                            <p className="font-semibold text-xs text-gray-500 truncate">
                                                {exercise.equipments.slice(0, 2).map(capitalizeFirst).join(', ')}
                                                {exercise.equipments.length > 2 && ` +${exercise.equipments.length - 2} more`}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Muscle Groups - Clean chip design */}
                                <div className="space-y-1">
                                    {/* Body parts - minimal, clean */}
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] font-medium text-gray-500 w-12 flex-shrink-0">Targets</span>
                                        <div className="flex flex-wrap gap-0.5">
                                            {exercise.bodyParts.slice(0, 3).map(part => (
                                                <span key={part} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700">
                                                    {capitalizeFirst(part)}
                                                </span>
                                            ))}
                                            {exercise.bodyParts.length > 3 && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-gray-500 bg-gray-50">
                                                    +{exercise.bodyParts.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Primary muscles */}
                                    {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-medium text-gray-500 w-12 flex-shrink-0">Primary</span>
                                            <div className="flex flex-wrap gap-0.5">
                                                {exercise.targetMuscles.slice(0, 2).map((muscle, index) => (
                                                    <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-100">
                                                        {capitalizeFirst(muscle)}
                                                    </span>
                                                ))}
                                                {exercise.targetMuscles.length > 2 && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-gray-500 bg-gray-50">
                                                        +{exercise.targetMuscles.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Secondary muscles */}
                                    {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-medium text-gray-500 w-12 flex-shrink-0">Support</span>
                                            <div className="flex flex-wrap gap-0.5">
                                                {[...new Set(exercise.secondaryMuscles)].slice(0, 2).map((muscle, index) => (
                                                    <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                                        {capitalizeFirst(muscle)}
                                                    </span>
                                                ))}
                                                {[...new Set(exercise.secondaryMuscles)].length > 2 && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-gray-500 bg-gray-50">
                                                        +{[...new Set(exercise.secondaryMuscles)].length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons - horizontal layout, more subtle */}
                            <div className="w-1/4 flex flex-col items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                {
                                    isDayList && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleRemoveFromDay}
                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-blue-50 rounded"
                                            title="Add to Day"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )
                                }
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleShowDetails}
                                    className="text-blue-700 hover:text-gray-600 hover:bg-gray-100 rounded"
                                    title="View Details"
                                >
                                    <Eye className="!h-4 !w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Exercise Details Modal */}
            <ExerciseDetailsModal
                exercise={exercise}
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
            />
        </>
    )
}

export default SinglExerciseCard