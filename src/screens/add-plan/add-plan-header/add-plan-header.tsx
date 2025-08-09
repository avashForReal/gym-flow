import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, X } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface AddPlanHeaderProps {
    isFirstStep: boolean
    handleBack: () => void
    handleCancel: () => void
    currentStepData: any
    currentStepNumber: number
    totalSteps: number
    progress: number
}

const AddPlanHeader = ({
    isFirstStep,
    handleBack,
    handleCancel,
    currentStepData,
    currentStepNumber,
    totalSteps,
    progress
}: AddPlanHeaderProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border z-20">
            <div className="flex items-center px-2 py-2">
                {!isFirstStep ? (
                    <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 p-0">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                ) : (
                    <div className="h-8 w-8" />
                )}
                <div className="flex-1 flex flex-col items-center mx-2">
                    <h1 className="font-bold text-sm">{currentStepData.title}</h1>
                    <span className="text-xs text-muted-foreground mt-0.5">
                        Step {currentStepNumber + 1} of {totalSteps}
                    </span>
                    <Progress value={progress} className="h-1 mt-1 w-24" />
                </div>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={() => setOpen(true)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Discard Plan?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to cancel? All unsaved changes will be lost.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Keep Editing
                                </Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        setOpen(false);
                                        handleCancel();
                                    }}
                                >
                                    Discard
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default AddPlanHeader