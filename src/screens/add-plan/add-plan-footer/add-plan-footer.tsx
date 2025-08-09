import { Button } from "@/components/ui/button"
import type { WorkoutPlanFormData } from "@/validations/workout-plan"
import { ArrowRight, Check } from "lucide-react"
import type { UseFormHandleSubmit } from "react-hook-form"

interface AddPlanFooterProps {
    isLastStep: boolean
    handleSubmit: UseFormHandleSubmit<WorkoutPlanFormData>
    onSubmit: (data: WorkoutPlanFormData) => void
    isSubmitting: boolean
    handleNext: () => void
}

const AddPlanFooter = ({ isLastStep, handleSubmit, onSubmit, isSubmitting, handleNext }: AddPlanFooterProps) => {
    return (
        <div className="fixed bottom-[3.5rem] left-0 right-0 bg-background border-t border-border z-20">
            <div className="px-2 py-2">
                {isLastStep ? (
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="w-full h-10 text-sm font-medium flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span className="text-xs">Saving...</span>
                            </div>
                        ) : (
                            <>
                                <Check className="h-4 w-4 mr-1" />
                                <span className="truncate">Create Plan</span>
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="w-full h-10 text-sm font-medium flex items-center justify-center"
                    >
                        <span className="truncate">Continue</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                )}
            </div>
        </div>
    )
}

export default AddPlanFooter