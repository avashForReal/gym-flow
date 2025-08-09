import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "@tanstack/react-router"
import { Dumbbell, Plus } from "lucide-react"

const PlansEmpty = () => {
  const navigate = useNavigate()
  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50 text-center py-8">
      <CardContent className="p-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Dumbbell className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-base font-bold mb-2">Ready to start training?</h3>
        <p className="text-muted-foreground mb-5 text-xs max-w-[200px] mx-auto">
          Create your first workout plan to get started.
        </p>
        <Button
          onClick={() => navigate({ to: '/add-plan' })}
          className="h-10 px-4 rounded-md text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Your First Plan
        </Button>
      </CardContent>
    </Card>
  )
}

export default PlansEmpty