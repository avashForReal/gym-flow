import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

type PlanDetailsHeaderProps = {
    planName: string
    planDescription?: string
    handleBackToPlans: () => void
}

const PlanDetailsHeader = ({ planName, planDescription, handleBackToPlans }: PlanDetailsHeaderProps) => {
    return (
        <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 p-0" onClick={handleBackToPlans}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
                <h1 className="text-base font-semibold text-slate-900 dark:text-white truncate">{planName}</h1>
                {planDescription && (
                    <p className="text-xs text-muted-foreground truncate">{planDescription}</p>
                )}
            </div>
        </div>
    )
}

export default PlanDetailsHeader