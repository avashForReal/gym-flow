import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { Home, Calendar, Activity } from 'lucide-react'
import Header from '@/components/header/header'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/"
            className="flex flex-col items-center py-2 px-4 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            activeProps={{
              className: "flex flex-col items-center py-2 px-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            }}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          <Link
            to="/plans"
            className="flex flex-col items-center py-2 px-4 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            activeProps={{
              className: "flex flex-col items-center py-2 px-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            }}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Plans</span>
          </Link>

          <Link
            to="/logs"
            className="flex flex-col items-center py-2 px-4 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            activeProps={{
              className: "flex flex-col items-center py-2 px-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            }}
          >
            <Activity className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Logs</span>
          </Link>
        </div>
      </div>
    </div>
  ),
})
