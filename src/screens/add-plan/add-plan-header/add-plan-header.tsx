import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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
    handleCancel: () => void
    currentStepData: any
    currentStepNumber: number
    totalSteps: number
}

const AddPlanHeader = ({
    handleCancel,
    currentStepData,
    currentStepNumber,
    totalSteps,
}: AddPlanHeaderProps) => {
    const [open, setOpen] = useState(false);
    const Icon = currentStepData.icon;

    return (
        <div className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border z-20">
            <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-2 ml-4">
                    <div><Icon className="w-8 h-8 text-primary bg-primary/10 p-2 rounded-sm" /></div>
                    <div className="flex-1 flex flex-col items-start mx-2">
                        <h1 className="font-bold text-sm flex items-center gap-1">{currentStepData.title}</h1>
                        <span className="text-xs text-muted-foreground mt-0.5">
                            Step {currentStepNumber + 1} of {totalSteps}
                        </span>
                    </div>
                </div>


                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={() => setOpen(true)}
                        >
                            <X className="!h-4 !w-4" />
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