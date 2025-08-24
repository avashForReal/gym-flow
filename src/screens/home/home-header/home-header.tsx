import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Logo from "../../../components/logo/logo"
import { useNavigate } from "@tanstack/react-router"

const HomeHeader = () => {
  const navigate = useNavigate()

  const handleNavigateToSettings = () => {
    navigate({
      to: "/settings"
    })
  }

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <Logo />
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleNavigateToSettings}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeHeader