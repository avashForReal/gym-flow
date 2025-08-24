import type { WorkoutSet } from "@/lib/database";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { capitalizeFirst } from "@/lib/string-helper";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


type SessionDetailsModalProps = {
    sessionDetails: {
        exerciseName: string;
        createdAt: Date;
        sets: WorkoutSet[];
    };
    isOpen: boolean;
    onClose: () => void;
}

const SessionDetailsModal = ({ sessionDetails, isOpen, onClose }: SessionDetailsModalProps) => {
    const { exerciseName, createdAt, sets } = sessionDetails;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
                <VisuallyHidden>
                    <DialogTitle>Session Details</DialogTitle>
                </VisuallyHidden>
                <div className="space-y-6">
                    {/* Exercise and Date Info */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[260px]">
                                {capitalizeFirst(exerciseName)}
                            </h3>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {createdAt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    {/* Sets List */}
                    <div className="space-y-3">
                        <div className="space-y-2">
                            {sets.map((set, index) => (
                                <div
                                    key={set.id || index}
                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                                            {index + 1}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Set {index + 1}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {set.weight} kgs
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Weight
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {set.reps}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Reps
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SessionDetailsModal;