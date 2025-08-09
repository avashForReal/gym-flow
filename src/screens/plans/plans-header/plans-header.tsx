import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

const PlansHeader = () => {
    const navigate = useNavigate()
    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border/50">
            <div className="p-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Workout Plans
                    </h1>
                    <p className="text-muted-foreground text-xs mt-0.5">
                        Manage your workout routines.
                    </p>
                </div>
                <Button
                    onClick={() => navigate({ to: '/add-plan' })}
                    className="h-8 px-2 rounded-md"
                >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Plan
                </Button>
            </div>
        </div>
    )
}

export default PlansHeader