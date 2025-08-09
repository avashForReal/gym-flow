import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Dumbbell,
  Plus,
  Play,
  History,
  Trophy,
  Clock,
  ArrowRight
} from "lucide-react"
import Header from "@/components/header/header"
import { usePlans } from "@/hooks/usePlans"
import { useNavigate } from "@tanstack/react-router"
const Home = () => {
  const { getActivePlan } = usePlans();
  const activePlan = getActivePlan();
  const [todayProgress] = useState(0);

  const navigate = useNavigate();

  const handleNavigateToPlans = () => {
    navigate({ to: "/plans" });
  }

  const getDayName = (dayIndex: number) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days[dayIndex]
  }

  const quickActions = [
    {
      title: "Start Today's Workout",
      description: "Begin your scheduled workout",
      icon: Play,
      action: () => console.log("Start workout"),
      color: "bg-gradient-to-r from-green-500 to-emerald-600",
      disabled: !activePlan
    },
    {
      title: "Create New Plan",
      description: "Design a custom workout plan",
      icon: Plus,
      action: () => console.log("Create plan"),
      color: "bg-gradient-to-r from-blue-500 to-indigo-600"
    },
    {
      title: "View History",
      description: "Check your workout progress",
      icon: History,
      action: () => console.log("View history"),
      color: "bg-gradient-to-r from-purple-500 to-violet-600"
    },
    {
      title: "Personal Records",
      description: "See your achievements",
      icon: Trophy,
      action: () => console.log("View PRs"),
      color: "bg-gradient-to-r from-orange-500 to-red-600"
    }
  ]

  return (
    <div>
      <Header />
      <div className="px-4 py-4 space-y-4">
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Active Plan
                </CardTitle>
                <CardDescription>
                  {activePlan ? `Following: ${activePlan.name}` : "No active plan selected"}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => console.log("Manage plans")}>
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activePlan ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Today's Progress</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{todayProgress}%</span>
                  </div>
                  <Progress value={todayProgress} className="h-2" />
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg text-center text-sm ${i === new Date().getDay() - 1
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600'
                        : 'bg-slate-100 dark:bg-slate-700/50'
                        }`}
                    >
                      <div className="font-medium">{getDayName(i).slice(0, 3)}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {activePlan.days?.[i]?.exercises?.length || 0} exercises
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Active Plan</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Create or select a workout plan to get started!
                </p>
                <Button className="px-4!" onClick={handleNavigateToPlans}>
                  Plans
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 cursor-pointer ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                onClick={action.disabled ? undefined : action.action}
              >
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">{action.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Recent Workouts</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Start your first workout to see your activity here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home