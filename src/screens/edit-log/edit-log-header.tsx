import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

type EditLogHeaderProps = {
    handleBack: () => void
}

const EditLogHeader = ({ handleBack }: EditLogHeaderProps) => {
    return (
        <div className="flex items-center gap-2 p-2">
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 p-0"
                onClick={handleBack}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
                <span className="font-semibold text-base text-slate-900 dark:text-white">
                    Edit Workout Log
                </span>
            </div>
        </div>
    )
}

export default EditLogHeader