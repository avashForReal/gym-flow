import { useWorkoutPlanWizard } from "@/hooks/useWorkoutPlanWizard";
import { Route } from "@/routes/edit-plans/$planId"
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workoutPlanSchema, type WorkoutPlanFormData } from "@/validations/workout-plan";
import { usePlans } from "@/hooks/usePlans";
import { Loader } from "@/components/loader/loader";
import PlanHeader from "../plan-header/plan-header";
import PlanFooter from "../plan-footer/plan-footer";
import { useNavigate } from "@tanstack/react-router";

const EditPlan = () => {
    const navigate = useNavigate()
    const { planId } = Route.useParams();

    const { isLoading, getPlanById } = usePlans({
        enableFetchPlans: true
    });
    const plan = getPlanById(Number(planId));

    const form = useForm<WorkoutPlanFormData>({
        resolver: zodResolver(workoutPlanSchema),
        values: plan,
        mode: 'onBlur',
    });
    const { handleSubmit } = form;

    const {
        isSubmitting,
        totalSteps,
        isFirstStep,
        isLastStep,
        currentStepNumber,
        currentStepData,
        StepComponent,
        setIsSubmitting,
        handleNext,
        handleBack,
    } = useWorkoutPlanWizard({
        form
    });

    const onSubmit = async (data: WorkoutPlanFormData) => {
        try {
            setIsSubmitting(true);
            console.log("data", data)
            //   await handleSavePlan(data)
            navigate({ to: '/plans' })
        } catch (error) {
            console.error('Error saving workout plan:', error);
            // Handle error (show toast, etc.)
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleCancel = () => {
        return navigate({ to: '/plans' })
    }

    if (isLoading) {
        return <Loader />
    };

    if (!plan) {
        return <div>Plan not found</div>
    }

    return (
        <FormProvider {...form}>
            <div className="h-screen bg-background">
                <PlanHeader
                    currentStepData={currentStepData}
                    currentStepNumber={currentStepNumber}
                    totalSteps={totalSteps}
                    handleCancel={handleCancel}
                />

                <div className="pt-[4rem] pb-[10rem] h-full overflow-y-auto w-full">
                    <StepComponent
                        onNext={handleNext}
                        onBack={handleBack}
                        isFirst={isFirstStep}
                        isLast={isLastStep}
                    />
                </div>

                {/* Footer - fixed at bottom above navigation */}
                <PlanFooter
                    isFirstStep={isFirstStep}
                    handleBack={handleBack}
                    isLastStep={isLastStep}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    handleNext={handleNext}
                    isEdit={true}
                />
            </div>
        </FormProvider>
    );
}

export default EditPlan