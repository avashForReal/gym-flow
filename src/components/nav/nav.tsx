import { Link } from "@tanstack/react-router"
import { Activity, Calendar, Home } from "lucide-react"

const Nav = () => {
    return (
        <div className="h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-around pt-2 pb-4 px-2">
                <Link
                    to="/"
                    className="flex flex-col items-center py-1 px-4 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] justify-center"
                    activeProps={{
                        className: "flex flex-col items-center py-1 px-4 text-blue-600 dark:text-blue-400 min-h-[44px] justify-center"
                    }}
                >
                    <Home className="h-3 w-3 mb-1" />
                    <span className="text-[0.7rem] font-medium">Home</span>
                </Link>

                <Link
                    to="/plans"
                    className="flex flex-col items-center py-1 px-4 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] justify-center"
                    activeProps={{
                        className: "flex flex-col items-center py-1 px-4 text-blue-600 dark:text-blue-400 min-h-[44px] justify-center"
                    }}
                >
                    <Calendar className="h-3 w-3 mb-1" />
                    <span className="text-[0.7rem] font-medium">Plans</span>
                </Link>

                <Link
                    to="/logs"
                    className="flex flex-col items-center py-1 px-4 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] justify-center"
                    activeProps={{
                        className: "flex flex-col items-center py-1 px-4 text-blue-600 dark:text-blue-400 min-h-[44px] justify-center"
                    }}
                >
                    <Activity className="h-3 w-3 mb-1" />
                    <span className="text-[0.7rem] font-medium">Logs</span>
                </Link>
            </div>
        </div>
    )
}

export default Nav