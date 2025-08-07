import { useInitializeUser, useIsFirstTimeUser, useIsLoading } from "@/stores/userStore"
import { useEffect } from "react"
import { OnboardingFlow } from "../onboarding/OnboardingFlow"

const Home = () => {
  const isLoading = useIsLoading()
  const isFirstTimeUser = useIsFirstTimeUser()
  const initializeUser = useInitializeUser()

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
    </div>
  )
}

export default Home