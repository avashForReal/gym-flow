import { Button } from "@/components/ui/button"
import { Settings, User } from "lucide-react"
import { useCurrentUser, useResetUser } from "@/stores/userStore"

const Header = () => {
  const currentUser = useCurrentUser()
  const resetUser = useResetUser()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              GYMFLOW
            </h1>
            {currentUser && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {getGreeting()}, {currentUser.name}!
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => console.log("Settings")}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => resetUser()}>
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header