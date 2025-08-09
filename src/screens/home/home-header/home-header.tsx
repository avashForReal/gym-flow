import { Button } from "@/components/ui/button"
import { LogOut, Settings } from "lucide-react"
import { useResetUser } from "@/stores/userStore"
import Logo from "../../../components/logo/logo"

const HomeHeader = () => {
  const resetUser = useResetUser()

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <Logo />
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => console.log("Settings")}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => resetUser()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeHeader