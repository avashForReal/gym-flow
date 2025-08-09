import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/plans')({
  component: PlansPage,
})

function PlansPage() {
  const plans = [
    {
      id: 1,
      name: "Push Pull Legs",
      days: 6,
      isActive: true,
      lastModified: "2024-01-15"
    },
    {
      id: 2,
      name: "Upper Lower Split",
      days: 4,
      isActive: false,
      lastModified: "2024-01-10"
    }
  ]

  return (
    <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Workout Plans</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your training programs</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>

        {/* Plans List */}
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${plan.isActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                      <Calendar className={`h-5 w-5 ${plan.isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`} />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {plan.name}
                        {plan.isActive && (
                          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                            Active
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {plan.days} days • Last modified {plan.lastModified}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {!plan.isActive && (
                    <Button size="sm">
                      Set Active
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {plans.length === 0 && (
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Workout Plans</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Create your first workout plan to get started
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
  )
}
