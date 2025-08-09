import { Link } from "@tanstack/react-router"
import { Activity, Calendar, Home } from "lucide-react"

const Nav = () => {
    return (
        <div className="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-around py-3 px-2">
                <Link
                    to="/"
                    className="flex flex-col items-center py-2 px-6 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] justify-center"
                    activeProps={{
                        className: "flex flex-col items-center py-2 px-6 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 min-h-[44px] justify-center"
                    }}
                >
                    <Home className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">Home</span>
                </Link>

                <Link
                    to="/plans"
                    className="flex flex-col items-center py-2 px-6 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] justify-center"
                    activeProps={{
                        className: "flex flex-col items-center py-2 px-6 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 min-h-[44px] justify-center"
                    }}
                >
                    <Calendar className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">Plans</span>
                </Link>

                <Link
                    to="/logs"
                    className="flex flex-col items-center py-2 px-6 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] justify-center"
                    activeProps={{
                        className: "flex flex-col items-center py-2 px-6 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 min-h-[44px] justify-center"
                    }}
                >
                    <Activity className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">Logs</span>
                </Link>
            </div>
        </div>
    )
}

export default Nav