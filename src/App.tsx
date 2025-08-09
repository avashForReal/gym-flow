import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { useCurrentUser, useInitializeUser, useIsFirstTimeUser, useIsLoading } from "@/stores/userStore"
import { useEffect } from "react"
import { OnboardingFlow } from "./screens/onboarding/OnboardingFlow"

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const isLoading = useIsLoading()
  const isFirstTimeUser = useIsFirstTimeUser()
  const initializeUser = useInitializeUser()
  const currentUser = useCurrentUser()

  useEffect(() => {
    initializeUser()
  }, [])

  // Show onboarding for first-time users
  if (isFirstTimeUser || !currentUser) {
    return <OnboardingFlow isLoading={isLoading} />
  }

  return <RouterProvider router={router} />
}

export default App
