import { useState } from "react"
import SettingsHeader from "./settings-header"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
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
} from "@/components/ui/alert-dialog"
import { useResetUser } from "@/stores/userStore"

const Settings = () => {
    const [open, setOpen] = useState(false)
    const resetUser = useResetUser()

    const handleResetData = async () => {
        try {
            await resetUser()
            setOpen(false)
        } catch (error) {
            console.error('Failed to reset data:', error)
        }
    }

    return (
        <div>
            <SettingsHeader />

            <div className="p-4 space-y-4">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Data Management</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your workout data and app settings
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">Reset All Data</h4>
                                <p className="text-sm text-muted-foreground">
                                    This will permanently delete all your workout data, plans, and profile information.
                                </p>
                            </div>
                            
                            <AlertDialog open={open} onOpenChange={setOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setOpen(true)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Reset Data
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Reset All Data?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. All your data is stored locally and this will permanently delete:
                                            <br /><br />
                                            • Your profile information<br />
                                            • All workout plans<br />
                                            • All workout history<br />
                                            • All exercise logs<br />
                                            • All progress data<br /><br />
                                            This will reset the app to its initial state as if you just installed it.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel asChild>
                                            <Button
                                                variant="outline"
                                                onClick={() => setOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <Button
                                                variant="destructive"
                                                onClick={handleResetData}
                                            >
                                                Yes, Reset Everything
                                            </Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings