import Logo from "@/components/logo/logo"

const SettingsHeader = () => {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <Logo />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsHeader