import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Dumbbell,
  Plus,
  Play,
  ArrowRight
} from "lucide-react"
import HomeHeader from "@/screens/home/home-header/home-header"
import { usePlans } from "@/hooks/usePlans"
import { useNavigate } from "@tanstack/react-router"
import { getGreeting, getTodaysFormattedDate } from "@/lib/date-helper"
import { useCurrentUser } from "@/stores/userStore"
import { capitalizeFirst } from "@/lib/string-helper"
import RecentActivity from "./recent-activity"
const Home = () => {
  const currentUser = useCurrentUser()
  const { activePlan } = usePlans({
    enableFetchPlans: true
  });
  const navigate = useNavigate();
  const handleNavigateToPlans = () => {
    navigate({ to: "/plans" });
  }

  const handleNavigateToActivePlan = () => {
    navigate({
      to: "/plan-details/$planId", params: {
        planId: activePlan?.id!.toString()!
      }
    });
  }

  const handleNavigateToCreatePlan = () => {
    navigate({
      to: '/add-plan'
    });
  }

  const handleNavigateToLogs = () => {
    navigate({
      to: '/logs'
    });
  }

  const quickActions = [
    {
      title: "Log Workout",
      description: "Log your workouts!",
      icon: Play,
      action: handleNavigateToLogs,
      color: "bg-gradient-to-r from-green-500 to-emerald-600",
    },
    {
      title: "Create New Plan",
      description: "Design a custom workout plan",
      icon: Plus,
      action: handleNavigateToCreatePlan,
      color: "bg-gradient-to-r from-blue-500 to-indigo-600"
    },
  ]

  return (
    <div>
      <HomeHeader />
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center gap-2 mb-3 mx-1">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {getTodaysFormattedDate()}
            </div>
            {currentUser && (
              <p className="text-base font-semibold text-slate-800 dark:text-white leading-tight">
                {getGreeting()}, <span className="font-bold">{currentUser.name}</span>!
              </p>
            )}
          </div>
        </div>

        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          {
            activePlan && (
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5" />
                      Active Plan
                    </CardTitle>
                    <CardDescription>
                      {activePlan ? `Following: ${capitalizeFirst(activePlan.name)}` : "No active plan found!"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            )
          }
          <CardContent>
            {activePlan ? (
              <div className="space-y-2">
                <Button className="px-4!" onClick={handleNavigateToActivePlan}>
                  Plan Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Dumbbell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Active Plan Found!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Create or select a workout plan to get started.
                </p>
                <Button className="px-4!" onClick={handleNavigateToPlans}>
                  Go To Plans
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
                className={`p-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105`}
                onClick={action.action}
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

        <RecentActivity />
      </div>
    </div>
  )
}

export default Home