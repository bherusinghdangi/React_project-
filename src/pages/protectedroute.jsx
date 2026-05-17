import { Navigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";

/**
 * requireAuth     - user must be logged in
 * requireOnboarding - user must have completed onboarding
 * blockIfOnboarded  - redirect away if onboarding already done (for /onboarding route)
 */
export default function ProtectedRoute({
  children,
  requireAuth       = false,
  requireOnboarding = false,
  blockIfOnboarded  = false,
}) {
  const { user, profile } = useUserStore();

  // not logged in → go to login
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // logged in but onboarding not done → force onboarding
  if (requireOnboarding && user && !profile?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  // already onboarded → block access to /onboarding again
  if (blockIfOnboarded && profile?.onboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}