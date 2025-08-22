import { Button } from "@/components/ui/button"
import type { WorkoutPlanFormData } from "@/validations/workout-plan"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import type { UseFormHandleSubmit } from "react-hook-form"

interface PlanFooterProps {
    isLastStep: boolean
    handleSubmit: UseFormHandleSubmit<WorkoutPlanFormData>
    onSubmit: (data: WorkoutPlanFormData) => void
    isSubmitting: boolean
    handleNext: () => void
    isFirstStep: boolean
    handleBack: () => void
}

const PlanFooter = ({ isLastStep, handleSubmit, onSubmit, isSubmitting, handleNext, isFirstStep, handleBack }: PlanFooterProps) => {
    return (
        <div className="fixed bottom-[5rem] left-0 right-0 bg-background border-t border-border z-20">
            <div className="px-6 py-2 flex gap-2 max-w-md mx-auto">
                <Button
                    onClick={handleBack}
                    disabled={isFirstStep}
                    variant="outline"
                    className="h-9 w-1/2 text-sm font-medium flex items-center gap-1 justify-center"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="truncate">Back</span>
                </Button>
                {isLastStep ? (
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="h-9 w-1/2 text-sm font-medium flex items-center gap-1 justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span className="text-xs">Saving...</span>
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                <span className="truncate">Create Plan</span>
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="h-9 w-1/2 text-sm font-medium flex items-center gap-1 justify-center"
                    >
                        <span className="truncate">Continue</span>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}

export default PlanFooter