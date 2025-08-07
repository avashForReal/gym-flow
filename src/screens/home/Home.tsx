import { useInitializeUser, useIsFirstTimeUser, useIsLoading, useResetUser } from "@/stores/userStore"
import { useEffect } from "react"
import { OnboardingFlow } from "../onboarding/OnboardingFlow"
import { Button } from "@/components/ui/button"

const Home = () => {
  const isLoading = useIsLoading()
  const isFirstTimeUser = useIsFirstTimeUser()
  const initializeUser = useInitializeUser()
  const resetUser = useResetUser()

  useEffect(() => {
    initializeUser()
  }, [])

  // show onboarding for first-time users
  if (isFirstTimeUser) {
    return <OnboardingFlow isLoading={isLoading} />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <h1>Home</h1>
      <Button onClick={() => resetUser()}>Reset User</Button>
    </div>
  )
}

export default Home