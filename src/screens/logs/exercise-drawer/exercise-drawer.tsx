import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExercises } from "@/hooks/useExercises";
import { Dumbbell, Filter, Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { capitalizeFirst } from "@/lib/string-helper";
import SinglExerciseCard from "../../plans-wizard/steps/SinglExerciseCard";
import { useNavigate } from "@tanstack/react-router";

type ExerciseDrawerProps = {
    setIsExerciseDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ExerciseDrawer = ({
    setIsExerciseDrawerOpen,
}: ExerciseDrawerProps) => {
    const navigate = useNavigate()
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');
    const [selectedBodyPart, setSelectedBodyPart] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState('');

    const { exercises, bodyParts, muscles, isLoadingExercises, totalCount } = useExercises({
        query: exerciseSearchQuery,
        bodyPart: selectedBodyPart,
        muscle: selectedMuscle,
    });

    const clearAllFilters = useCallback(() => {
        setExerciseSearchQuery('');
        setSelectedBodyPart('');
        setSelectedMuscle('');
        setIsFilterPanelOpen(false);
    }, []);

    const totalActiveFilters = useMemo(() => {
        return (
            (selectedBodyPart ? 1 : 0) + (selectedMuscle ? 1 : 0) + (exerciseSearchQuery ? 1 : 0)
        )
    }, [exerciseSearchQuery, selectedBodyPart, selectedMuscle])

    const hasActiveFilters = useMemo(() => totalActiveFilters > 0, [totalActiveFilters]);


    const handleAddToLog = (exerciseId: string) => {
        navigate({
            to: '/add-log/$exerciseId',
            params: {
                exerciseId
            }
        })
    }


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-background w-full h-[80vh] rounded-t-xl overflow-hidden flex flex-col">
                {/* Modal Header - Fixed */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20 flex-shrink-0">
                    <h3 className="text-base font-semibold text-gray-800">Choose Exercise</h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setIsExerciseDrawerOpen(false)
                        }}
                        className="h-8 w-8 text-gray-800"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Search Section - Fixed */}
                <div className="px-4 py-2 border-b border-border bg-gradient-to-b from-background to-muted/30 flex-shrink-0">
                    <div className="flex gap-1 mb-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                                placeholder="Search exercises..."
                                value={exerciseSearchQuery}
                                onChange={(e) => setExerciseSearchQuery(e.target.value)}
                                className="pl-7 h-8 text-base form-input"
                            />
                        </div>
                        <Button
                            variant={hasActiveFilters || isFilterPanelOpen ? "default" : "outline"}
                            size="icon"
                            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                            className="h-8 w-8 flex-shrink-0 relative"
                        >
                            <Filter className="h-3 w-3" />
                            {hasActiveFilters && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-foreground rounded-full flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-primary">
                                        {totalActiveFilters}
                                    </span>
                                </div>
                            )}
                        </Button>
                    </div>

                    {/* Active Filters Display - Fixed */}
                    {hasActiveFilters && (
                        <div className="space-y-1 pt-2 border-t border-primary/20 bg-primary/5 rounded-lg p-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-medium text-primary tracking-wide">Active Filters:</span>
                                <Button
                                    variant="ghost"
                                    onClick={clearAllFilters}
                                    className="h-5 px-1.5 text-[10px] text-primary hover:text-primary hover:bg-primary/20"
                                >
                                    Clear all
                                </Button>
                            </div>
                            <div className="flex items-center gap-1 flex-wrap">
                                {exerciseSearchQuery && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 border-blue-200">
                                        <Search className="h-2.5 w-2.5 mr-0.5" />
                                        "{exerciseSearchQuery}"
                                    </Badge>
                                )}
                                {selectedBodyPart && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-800 border-green-200">
                                        <span className="mr-0.5">🏃</span>
                                        {capitalizeFirst(selectedBodyPart)}
                                    </Badge>
                                )}
                                {selectedMuscle && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-800 border-purple-200">
                                        <span className="mr-0.5">💪</span>
                                        {capitalizeFirst(selectedMuscle)}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {/* Filter Panel */}
                    {isFilterPanelOpen && (
                        <div className="border-b border-border bg-gradient-to-b from-muted/20 to-muted/40">
                            <div className="p-2 space-y-3 bg-gray-50 px-4">
                                {/* Body Part Filters */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-xs font-medium text-muted-foreground tracking-wide flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            Body Part
                                        </h4>
                                        {selectedBodyPart && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => setSelectedBodyPart('')}
                                                className="h-4 px-1 text-[10px] text-muted-foreground hover:text-foreground"
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                                        <Button
                                            variant={selectedBodyPart === '' ? "default" : "outline"}
                                            onClick={() => setSelectedBodyPart('')}
                                            className="flex-shrink-0 h-6 px-2 text-[10px] font-medium"
                                        >
                                            All
                                        </Button>
                                        {bodyParts.map(part => (
                                            <Button
                                                key={part}
                                                variant={selectedBodyPart === part ? "default" : "outline"}
                                                onClick={() => setSelectedBodyPart(part)}
                                                className="flex-shrink-0 h-6 px-2 text-[10px] font-medium whitespace-nowrap"
                                            >
                                                {capitalizeFirst(part)}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Muscle Filters */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-xs font-medium text-muted-foreground tracking-wide flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                            Target Muscle
                                        </h4>
                                        {selectedMuscle && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => setSelectedMuscle('')}
                                                className="h-4 px-1 text-[10px] text-muted-foreground hover:text-foreground"
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                                        <Button
                                            variant={selectedMuscle === '' ? "default" : "outline"}
                                            onClick={() => setSelectedMuscle('')}
                                            className="flex-shrink-0 h-6 px-2 text-[10px] font-medium"
                                        >
                                            All
                                        </Button>
                                        {muscles.map(muscle => (
                                            <Button
                                                key={muscle}
                                                variant={selectedMuscle === muscle ? "default" : "outline"}
                                                onClick={() => setSelectedMuscle(muscle)}
                                                className="flex-shrink-0 h-6 px-2 text-[10px] font-medium whitespace-nowrap"
                                            >
                                                {capitalizeFirst(muscle)}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Exercise Results Section */}
                    <div>
                        {/* Section Header */}
                        <div className="px-2 py-1 border-b border-border/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                            <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 tracking-wide flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                {isLoadingExercises ? 'Searching...' : totalCount > 0 ? `${totalCount} Exercise${totalCount === 1 ? '' : 's'} Found` : 'Search Results'}
                            </h4>
                        </div>

                        {/* Exercise Results Content */}
                        <div className="bg-gradient-to-b from-background to-muted/10">
                            {isLoadingExercises && (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                    <p className="text-muted-foreground font-medium">Searching exercises...</p>
                                    <p className="text-xs text-muted-foreground mt-1">Please wait while we find the best matches</p>
                                </div>
                            )}

                            {!isLoadingExercises && exercises.length > 0 && (
                                <div className="p-4 space-y-3">
                                    {exercises.map((exercise) => {
                                        return (
                                            <SinglExerciseCard
                                                exercise={exercise}
                                                key={exercise.exerciseId}
                                                onAddToDay={() => { }}
                                                onRemoveFromDay={() => { }}
                                                isSelected={false}
                                                isLog={true}
                                                onAddToLog={handleAddToLog}
                                            />
                                        )
                                    })}
                                </div>
                            )}

                            {!isLoadingExercises && (exerciseSearchQuery || selectedBodyPart || selectedMuscle) && exercises.length === 0 && (
                                <div className="text-center py-12">
                                    <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                    <p className="text-muted-foreground font-medium mb-2">No exercises found</p>
                                    <p className="text-xs text-muted-foreground">Try adjusting your search or filters above.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExerciseDrawer